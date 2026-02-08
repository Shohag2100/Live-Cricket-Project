
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'favorite_team', 'favorite_player', 'bio', 'avatar', 'notification_enabled']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UpdateProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source='profile.phone', allow_blank=True)
    favorite_team = serializers.CharField(source='profile.favorite_team', allow_blank=True)
    favorite_player = serializers.CharField(source='profile.favorite_player', allow_blank=True)
    bio = serializers.CharField(source='profile.bio', allow_blank=True)
    notification_enabled = serializers.BooleanField(source='profile.notification_enabled')
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'favorite_team', 
                  'favorite_player', 'bio', 'notification_enabled']
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        
        profile = instance.profile
        profile.phone = profile_data.get('phone', profile.phone)
        profile.favorite_team = profile_data.get('favorite_team', profile.favorite_team)
        profile.favorite_player = profile_data.get('favorite_player', profile.favorite_player)
        profile.bio = profile_data.get('bio', profile.bio)
        profile.notification_enabled = profile_data.get('notification_enabled', profile.notification_enabled)
        profile.save()
        
        return instance
