
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import Match, LiveStream, Favorite
from .serializers import MatchSerializer, LiveStreamSerializer, FavoriteSerializer
from .services import CricAPIService, YouTubeService
import logging

logger = logging.getLogger(__name__)

class MatchViewSet(viewsets.ModelViewSet):
    """ViewSet for cricket matches"""
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current/live matches from API"""
        cricapi = CricAPIService()
        matches_data = cricapi.get_current_matches()
        
        if not matches_data:
            return Response({'error': 'Failed to fetch matches'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Update or create matches in database
        for match_data in matches_data:
            try:
                Match.objects.update_or_create(
                    match_id=match_data.get('id'),
                    defaults={
                        'name': match_data.get('name', ''),
                        'match_type': match_data.get('matchType', ''),
                        'status': match_data.get('status', ''),
                        'venue': match_data.get('venue', ''),
                        'date': match_data.get('date'),
                        'team1': match_data.get('teamInfo', [{}])[0].get('name', '') if len(match_data.get('teamInfo', [])) > 0 else '',
                        'team2': match_data.get('teamInfo', [{}])[1].get('name', '') if len(match_data.get('teamInfo', [])) > 1 else '',
                        'score': match_data.get('score', ''),
                        'is_live': match_data.get('status') == 'Live',
                    }
                )
            except Exception as e:
                logger.error(f"Error creating match: {str(e)}")
        
        return Response(matches_data)
    
    @action(detail=False, methods=['get'])
    def live(self, request):
        """Get only live matches"""
        live_matches = Match.objects.filter(is_live=True)
        serializer = self.get_serializer(live_matches, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def score(self, request, pk=None):
        """Get live score for a specific match"""
        match = self.get_object()
        cricapi = CricAPIService()
        score_data = cricapi.get_live_score(match.match_id)
        
        if not score_data:
            return Response({'error': 'Failed to fetch score'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Update match score
        match.score = str(score_data)
        match.save()
        
        return Response(score_data)
    
    @action(detail=True, methods=['get'])
    def info(self, request, pk=None):
        """Get detailed match info"""
        match = self.get_object()
        cricapi = CricAPIService()
        match_info = cricapi.get_match_info(match.match_id)
        
        if not match_info:
            return Response({'error': 'Failed to fetch match info'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response(match_info)

class LiveStreamViewSet(viewsets.ModelViewSet):
    """ViewSet for live streams"""
    queryset = LiveStream.objects.filter(is_live=True)
    serializer_class = LiveStreamSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search for live cricket streams"""
        query = request.query_params.get('q', 'cricket live')
        max_results = int(request.query_params.get('max', 10))
        
        youtube = YouTubeService()
        streams = youtube.search_live_streams(query, max_results)

        # Try to associate streams with known matches to avoid saving general news/live-tv
        matches = list(Match.objects.all())
        saved = []

        for stream_data in streams:
            try:
                title_lower = (stream_data.get('title') or '').lower()

                matched_match = None
                for m in matches:
                    t1 = (m.team1 or '').lower()
                    t2 = (m.team2 or '').lower()

                    # require explicit vs or both team names present in title to consider this a match stream
                    if (' vs ' in title_lower or ' v ' in title_lower or 'vs.' in title_lower) and (t1 in title_lower or t2 in title_lower):
                        matched_match = m
                        break
                    if t1 and t2 and t1 in title_lower and t2 in title_lower:
                        matched_match = m
                        break

                if not matched_match:
                    # skip saving non-match streams to keep list focused
                    continue

                obj, created = LiveStream.objects.update_or_create(
                    video_id=stream_data['video_id'],
                    defaults={
                        'title': stream_data['title'],
                        'description': stream_data['description'],
                        'channel_title': stream_data['channel_title'],
                        'thumbnail_url': stream_data['thumbnail'],
                        'video_url': stream_data['url'],
                        'embed_url': stream_data['embed_url'],
                        'is_live': True,
                        'published_at': stream_data['published_at'],
                        'match': matched_match,
                    }
                )
                saved.append(obj)
            except Exception as e:
                logger.error(f"Error saving stream: {str(e)}")

        serializer = LiveStreamSerializer(saved, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def match_streams(self, request):
        """Get streams for a specific match"""
        team1 = request.query_params.get('team1')
        team2 = request.query_params.get('team2')
        
        if not team1 or not team2:
            return Response({'error': 'team1 and team2 are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        youtube = YouTubeService()
        streams = youtube.search_match_streams(team1, team2)
        
        return Response(streams)
    
    @action(detail=False, methods=['get'])
    def tournament(self, request):
        """Get streams for a tournament"""
        tournament = request.query_params.get('name', 'IPL')
        
        youtube = YouTubeService()
        streams = youtube.search_tournament_streams(tournament)
        
        return Response(streams)

class FavoriteViewSet(viewsets.ModelViewSet):
    """ViewSet for user favorites"""
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle favorite status"""
        match_id = request.data.get('match_id')
        
        if not match_id:
            return Response({'error': 'match_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        match = get_object_or_404(Match, id=match_id)
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            match=match
        )
        
        if not created:
            favorite.delete()
            return Response({'status': 'removed'})
        
        return Response({'status': 'added', 'favorite': FavoriteSerializer(favorite).data})
