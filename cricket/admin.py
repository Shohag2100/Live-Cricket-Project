
from django.contrib import admin
from .models import Match, LiveStream, Favorite

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['name', 'team1', 'team2', 'status', 'is_live', 'date']
    list_filter = ['is_live', 'match_type', 'date']
    search_fields = ['name', 'team1', 'team2', 'venue']
    readonly_fields = ['match_id', 'created_at', 'updated_at']

@admin.register(LiveStream)
class LiveStreamAdmin(admin.ModelAdmin):
    list_display = ['title', 'channel_title', 'is_live', 'view_count', 'published_at']
    list_filter = ['is_live', 'published_at']
    search_fields = ['title', 'channel_title', 'description']
    readonly_fields = ['video_id', 'created_at', 'updated_at']

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'match', 'team_name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'team_name']