
from rest_framework import serializers
from .models import Match, LiveStream, Favorite

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class LiveStreamSerializer(serializers.ModelSerializer):
    match_name = serializers.CharField(source='match.name', read_only=True, allow_null=True)
    
    class Meta:
        model = LiveStream
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    match_details = MatchSerializer(source='match', read_only=True)
    
    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ['user']
