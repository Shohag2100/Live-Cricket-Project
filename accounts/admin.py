
from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'favorite_team', 'favorite_player', 'notification_enabled', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'favorite_team']
    list_filter = ['notification_enabled', 'created_at']