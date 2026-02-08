
from django.contrib import admin
from .models import Conversation, ChatMessage, UserFeedback

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ['sender', 'message', 'intent', 'confidence', 'created_at']
    can_delete = False

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_id', 'started_at', 'last_message_at', 'is_active']
    list_filter = ['is_active', 'started_at']
    search_fields = ['user__username', 'session_id']
    inlines = [ChatMessageInline]
    readonly_fields = ['started_at', 'last_message_at']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'sender', 'message', 'intent', 'confidence', 'created_at']
    list_filter = ['sender', 'intent', 'created_at']
    search_fields = ['message', 'intent']
    readonly_fields = ['created_at']

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'message', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['comment']
    readonly_fields = ['created_at']