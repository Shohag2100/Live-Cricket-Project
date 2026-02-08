
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Conversation, ChatMessage, UserFeedback
from .serializers import ConversationSerializer, ChatMessageSerializer, UserFeedbackSerializer
from .services import ResponseGenerator
import logging

logger = logging.getLogger(__name__)

class ChatbotViewSet(viewsets.ViewSet):
    """ViewSet for chatbot interactions"""
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.response_generator = ResponseGenerator()
    
    def get_or_create_conversation(self, request):
        """Get or create conversation for user/session"""
        if request.user.is_authenticated:
            conversation, created = Conversation.objects.get_or_create(
                user=request.user,
                is_active=True
            )
        else:
            session_id = request.session.session_key
            if not session_id:
                request.session.create()
                session_id = request.session.session_key
            
            conversation, created = Conversation.objects.get_or_create(
                session_id=session_id,
                is_active=True
            )
        
        return conversation
    
    @action(detail=False, methods=['post'])
    def chat(self, request):
        """Send a message and get bot response"""
        try:
            data = request.data
        except ParseError as e:
            raw = request.body or b''
            try:
                raw_text = raw.decode('utf-8')
            except Exception:
                raw_text = repr(raw)
            logger.warning(f"JSON parse error: {str(e)}; raw body preview: {raw_text[:200]}")
            return Response(
                {
                    'detail': f'JSON parse error - {str(e)}',
                    'raw_body_preview': raw_text[:200]
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user_message = (data.get('message') or '').strip()
        use_ai = data.get('use_ai', False)
        
        if not user_message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create conversation
        conversation = self.get_or_create_conversation(request)
        
        # Save user message
        user_chat_message = ChatMessage.objects.create(
            conversation=conversation,
            sender='user',
            message=user_message
        )
        
        # Generate bot response
        try:
            result = self.response_generator.generate_response(user_message, use_ai=use_ai)
            
            # Save bot response
            bot_chat_message = ChatMessage.objects.create(
                conversation=conversation,
                sender='bot',
                message=result['response'],
                intent=result['intent'],
                confidence=result['confidence'],
                action=result.get('action', '')
            )
            
            # Update conversation timestamp
            conversation.save()
            
            return Response({
                'user_message': ChatMessageSerializer(user_chat_message).data,
                'bot_message': ChatMessageSerializer(bot_chat_message).data,
                'intent': result['intent'],
                'confidence': result['confidence'],
                'action_data': result.get('action_data'),
                'entities': result.get('entities'),
                'conversation_id': conversation.id
            })
        
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            return Response(
                {'error': 'Failed to generate response'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get conversation history"""
        conversation = self.get_or_create_conversation(request)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def clear_history(self, request):
        """Clear conversation history"""
        conversation = self.get_or_create_conversation(request)
        conversation.messages.all().delete()
        return Response({'status': 'History cleared'})
    
    @action(detail=False, methods=['post'])
    def feedback(self, request):
        """Submit feedback for a bot response"""
        message_id = request.data.get('message_id')
        rating = request.data.get('rating')
        comment = request.data.get('comment', '')
        
        if not message_id or not rating:
            return Response(
                {'error': 'message_id and rating are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            message = ChatMessage.objects.get(id=message_id, sender='bot')
            feedback = UserFeedback.objects.create(
                message=message,
                rating=rating,
                comment=comment
            )
            return Response(UserFeedbackSerializer(feedback).data)
        
        except ChatMessage.DoesNotExist:
            return Response(
                {'error': 'Message not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class ConversationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing conversations"""
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Conversation.objects.all()
        return Conversation.objects.filter(user=self.request.user)
