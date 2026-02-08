
from rest_framework import serializers
from .models import Conversation, ChatMessage, UserFeedback

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'message', 'intent', 'confidence', 'action', 'created_at']
        read_only_fields = ['created_at']

class ConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'user', 'session_id', 'started_at', 'last_message_at', 
                  'is_active', 'messages', 'message_count']
        read_only_fields = ['started_at', 'last_message_at']
    
    def get_message_count(self, obj):
        return obj.messages.count()

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        read_only_fields = ['created_at']