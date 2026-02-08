from googleapiclient.discovery import build
from django.conf import settings
from django.core.cache import cache
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class YouTubeService:
    """Service for searching live cricket streams on YouTube"""
    
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        self.youtube = None
        
        if self.api_key:
            try:
                self.youtube = build('youtube', 'v3', developerKey=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize YouTube API: {str(e)}")
    
    def search_live_streams(self, query: str, max_results: int = 10) -> List[Dict]:
        """Search for live cricket streams"""
        if not self.youtube:
            logger.error("YouTube API not initialized")
            return []
        
        cache_key = f'youtube_live_{query}_{max_results}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        try:
            # broaden query to bias toward match streams
            q = query
            if 'cricket' not in q.lower():
                q = f"{q} cricket live match"

            search_response = self.youtube.search().list(
                q=q,
                part='snippet',
                type='video',
                eventType='live',
                maxResults=max_results,
                order='viewCount',
                relevanceLanguage='en'
            ).execute()

            def is_cricket_stream(item_snippet: Dict) -> bool:
                title = (item_snippet.get('title') or '').lower()
                desc = (item_snippet.get('description') or '').lower()
                channel = (item_snippet.get('channelTitle') or '').lower()

                # Prefer explicit match indicators (e.g., "Team A vs Team B")
                if ' vs ' in title or ' v ' in title or 'vs.' in title:
                    return True

                # If title contains the word 'cricket' and isn't an obvious news channel, keep it
                if 'cricket' in title or 'cricket' in desc:
                    if 'news' in channel or 'news' in title or 'breaking' in title:
                        return 'cricket' in title or 'cricket' in desc
                    return True

                # otherwise exclude (likely generic/live-tv or news)
                return False

            streams = []
            for item in search_response.get('items', []):
                snip = item.get('snippet', {})
                if not is_cricket_stream(snip):
                    continue

                stream_data = {
                    'video_id': item['id']['videoId'],
                    'title': snip.get('title'),
                    'description': snip.get('description'),
                    'channel_title': snip.get('channelTitle'),
                    'thumbnail': snip.get('thumbnails', {}).get('high', {}).get('url'),
                    'published_at': snip.get('publishedAt'),
                    'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    'embed_url': f"https://www.youtube.com/embed/{item['id']['videoId']}"
                }
                streams.append(stream_data)

            cache.set(cache_key, streams, 180)  # Cache for 3 minutes
            return streams
            
        except Exception as e:
            logger.error(f"YouTube search failed: {str(e)}")
            return []
    
    def get_video_details(self, video_id: str) -> Optional[Dict]:
        """Get detailed information about a video"""
        if not self.youtube:
            return None
        
        cache_key = f'youtube_video_{video_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        try:
            video_response = self.youtube.videos().list(
                part='snippet,contentDetails,statistics,liveStreamingDetails',
                id=video_id
            ).execute()
            
            if not video_response.get('items'):
                return None
            
            item = video_response['items'][0]
            video_data = {
                'video_id': video_id,
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'channel_title': item['snippet']['channelTitle'],
                'published_at': item['snippet']['publishedAt'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'view_count': item['statistics'].get('viewCount', '0'),
                'like_count': item['statistics'].get('likeCount', '0'),
                'is_live': 'liveStreamingDetails' in item,
                'url': f"https://www.youtube.com/watch?v={video_id}",
                'embed_url': f"https://www.youtube.com/embed/{video_id}"
            }
            
            if 'liveStreamingDetails' in item:
                video_data['concurrent_viewers'] = item['liveStreamingDetails'].get('concurrentViewers', '0')
            
            cache.set(cache_key, video_data, 300)  # Cache for 5 minutes
            return video_data
            
        except Exception as e:
            logger.error(f"Failed to get video details: {str(e)}")
            return None
    
    def search_match_streams(self, team1: str, team2: str) -> List[Dict]:
        """Search for streams of a specific match"""
        query = f"{team1} vs {team2} live cricket"
        return self.search_live_streams(query, max_results=5)
    
    def search_tournament_streams(self, tournament: str) -> List[Dict]:
        """Search for streams of a tournament"""
        query = f"{tournament} live cricket"
        return self.search_live_streams(query, max_results=10)