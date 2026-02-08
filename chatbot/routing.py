
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotViewSet, ConversationViewSet
from .consumers import ChatbotConsumer

router = DefaultRouter()
router.register('chat', ChatbotViewSet, basename='chatbot')
router.register('conversations', ConversationViewSet, basename='conversation')

urlpatterns = router.urls

# WebSocket routes for Channels
websocket_urlpatterns = [
	path('ws/chat/<int:conversation_id>/', ChatbotConsumer.as_asgi()),
]

