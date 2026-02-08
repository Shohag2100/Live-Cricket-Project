from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotViewSet, ConversationViewSet

router = DefaultRouter()
# Register the Chatbot viewset at the package root so endpoints become
# /api/chatbot/chat/, /api/chatbot/history/, etc.
router.register(r'', ChatbotViewSet, basename='chatbot')
router.register(r'conversations', ConversationViewSet, basename='conversations')

urlpatterns = [
    path('', include(router.urls)),
]
