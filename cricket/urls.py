
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, LiveStreamViewSet, FavoriteViewSet

router = DefaultRouter()
router.register('matches', MatchViewSet, basename='match')
router.register('streams', LiveStreamViewSet, basename='stream')
router.register('favorites', FavoriteViewSet, basename='favorite')

urlpatterns = router.urls