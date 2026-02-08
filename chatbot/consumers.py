
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, ChatMessage
from .services import ResponseGenerator
import logging

logger = logging.getLogger(__name__)

class ChatbotConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time chatbot"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.response_generator = ResponseGenerator()
    
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs'].get('conversation_id')
        self.room_group_name = f'chatbot_{self.conversation_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send welcome message
        await self.send(text_data=json.dumps({
            'type': 'connection',
            'message': 'Connected to chatbot'
        }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get('message', '').strip()
            use_ai = data.get('use_ai', False)
            
            if not message:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Empty message'
                }))
                return
            
            # Save user message
            user_msg = await self.save_message('user', message)
            
            # Generate bot response
            result = await self.generate_bot_response(message, use_ai)
            
            # Save bot message
            bot_msg = await self.save_message(
                'bot',
                result['response'],
                intent=result['intent'],
                confidence=result['confidence'],
                action=result.get('action', '')
            )
            
            # Send response
            await self.send(text_data=json.dumps({
                'type': 'message',
                'user_message': {
                    'id': user_msg['id'],
                    'message': user_msg['message'],
                    'sender': 'user',
                    'created_at': user_msg['created_at']
                },
                'bot_message': {
                    'id': bot_msg['id'],
                    'message': bot_msg['message'],
                    'sender': 'bot',
                    'intent': bot_msg['intent'],
                    'confidence': bot_msg['confidence'],
                    'created_at': bot_msg['created_at']
                },
                'action_data': result.get('action_data'),
                'entities': result.get('entities')
            }))
        
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            logger.error(f"WebSocket error: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'An error occurred'
            }))
    
    @database_sync_to_async
    def save_message(self, sender, message, intent='', confidence=None, action=''):
        """Save message to database"""
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            
            msg = ChatMessage.objects.create(
                conversation=conversation,
                sender=sender,
                message=message,
                intent=intent,
                confidence=confidence,
                action=action
            )
            
            conversation.save()  # Update last_message_at
            
            return {
                'id': msg.id,
                'message': msg.message,
                'sender': msg.sender,
                'intent': msg.intent,
                'confidence': msg.confidence,
                'created_at': msg.created_at.isoformat()
            }
        except Exception as e:
            logger.error(f"Error saving message: {str(e)}")
            return None
    
    async def generate_bot_response(self, message, use_ai=False):
        """Generate bot response asynchronously"""
        return await database_sync_to_async(
            self.response_generator.generate_response
        )(message, use_ai)
