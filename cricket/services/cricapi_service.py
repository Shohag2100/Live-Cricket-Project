import requests
from django.conf import settings
from django.core.cache import cache
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class CricAPIService:
    """Service for interacting with CricAPI"""
    
    def __init__(self):
        self.api_key = settings.CRICAPI_KEY
        self.base_url = settings.CRICAPI_BASE_URL
        self.headers = {
            'Content-Type': 'application/json'
        }
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Optional[Dict]:
        """Make API request to CricAPI"""
        if not self.api_key:
            logger.error("CricAPI key not configured")
            return None
        
        if params is None:
            params = {}
        
        params['apikey'] = self.api_key
        
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.get(url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"CricAPI request failed: {str(e)}")
            return None
    
    def get_current_matches(self) -> List[Dict]:
        """Get list of current/live matches"""
        cache_key = 'cricapi_current_matches'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('currentMatches')
        
        if data and data.get('status') == 'success':
            matches = data.get('data', [])
            cache.set(cache_key, matches, 60)  # Cache for 1 minute
            return matches
        
        return []
    
    def get_match_info(self, match_id: str) -> Optional[Dict]:
        """Get detailed info about a specific match"""
        cache_key = f'cricapi_match_{match_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('match_info', {'id': match_id})
        
        if data and data.get('status') == 'success':
            match_info = data.get('data', {})
            cache.set(cache_key, match_info, 30)  # Cache for 30 seconds
            return match_info
        
        return None
    
    def get_live_score(self, match_id: str) -> Optional[Dict]:
        """Get live score of a match"""
        cache_key = f'cricapi_live_score_{match_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('match_scorecard', {'id': match_id})
        
        if data and data.get('status') == 'success':
            score_data = data.get('data', {})
            cache.set(cache_key, score_data, 20)  # Cache for 20 seconds
            return score_data
        
        return None
    
    def get_series_list(self) -> List[Dict]:
        """Get list of cricket series"""
        cache_key = 'cricapi_series_list'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('series')
        
        if data and data.get('status') == 'success':
            series = data.get('data', [])
            cache.set(cache_key, series, 3600)  # Cache for 1 hour
            return series
        
        return []
    
    def get_series_info(self, series_id: str) -> Optional[Dict]:
        """Get information about a specific series"""
        cache_key = f'cricapi_series_{series_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('series_info', {'id': series_id})
        
        if data and data.get('status') == 'success':
            series_info = data.get('data', {})
            cache.set(cache_key, series_info, 1800)  # Cache for 30 minutes
            return series_info
        
        return None
    
    def get_player_info(self, player_id: str) -> Optional[Dict]:
        """Get player information"""
        cache_key = f'cricapi_player_{player_id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        data = self._make_request('players_info', {'id': player_id})
        
        if data and data.get('status') == 'success':
            player_info = data.get('data', {})
            cache.set(cache_key, player_info, 86400)  # Cache for 24 hours
            return player_info
        
        return None