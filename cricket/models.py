
from django.db import models
from django.contrib.auth.models import User

class Match(models.Model):
    """Store match information"""
    match_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    match_type = models.CharField(max_length=50)
    status = models.CharField(max_length=100)
    venue = models.CharField(max_length=255, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    team1 = models.CharField(max_length=100)
    team2 = models.CharField(max_length=100)
    score = models.TextField(blank=True)
    is_live = models.BooleanField(default=False)
    series_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.team1} vs {self.team2}"

class LiveStream(models.Model):
    """Store YouTube live stream information"""
    video_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    channel_title = models.CharField(max_length=255)
    thumbnail_url = models.URLField()
    video_url = models.URLField()
    embed_url = models.URLField()
    is_live = models.BooleanField(default=True)
    view_count = models.IntegerField(default=0)
    published_at = models.DateTimeField()
    match = models.ForeignKey(Match, on_delete=models.SET_NULL, null=True, blank=True, related_name='streams')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-view_count']
    
    def __str__(self):
        return self.title

class Favorite(models.Model):
    """User's favorite teams and matches"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    match = models.ForeignKey(Match, on_delete=models.CASCADE, null=True, blank=True)
    team_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'match']
    
    def __str__(self):
        return f"{self.user.username} - {self.team_name or self.match}"
