
import json
import os
import re
import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class IntentClassifier:
    """Classify user intents using pattern matching and ML"""
    
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.intents = self.load_intents()
        self.vectorizer = TfidfVectorizer(tokenizer=self.tokenize, stop_words='english')
        self.train_classifier()
    
    def load_intents(self):
        """Load intent data from JSON file"""
        intent_file = os.path.join(
            settings.BASE_DIR,
            'chatbot',
            'training_data',
            'sports_intents.json'
        )
        
        try:
            with open(intent_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Intent file not found: {intent_file}")
            return {"intents": []}
    
    def tokenize(self, text):
        """Tokenize and lemmatize text"""
        words = nltk.word_tokenize(text.lower())
        return [self.lemmatizer.lemmatize(word) for word in words if word.isalnum()]
    
    def train_classifier(self):
        """Train the classifier with patterns"""
        all_patterns = []
        self.intent_labels = []
        
        for intent in self.intents['intents']:
            for pattern in intent['patterns']:
                all_patterns.append(pattern)
                self.intent_labels.append(intent['tag'])
        
        if all_patterns:
            self.pattern_vectors = self.vectorizer.fit_transform(all_patterns)
    
    def classify(self, user_input):
        """Classify user input to an intent"""
        if not user_input:
            return 'fallback', 0.0
        
        # Vectorize user input
        input_vector = self.vectorizer.transform([user_input])
        
        # Calculate similarities
        similarities = cosine_similarity(input_vector, self.pattern_vectors).flatten()
        
        # Get best match
        best_match_idx = np.argmax(similarities)
        confidence = similarities[best_match_idx]
        
        # Return intent if confidence is high enough
        if confidence > 0.3:
            return self.intent_labels[best_match_idx], confidence
        
        return 'fallback', confidence
    
    def get_response(self, tag):
        """Get a random response for an intent tag"""
        for intent in self.intents['intents']:
            if intent['tag'] == tag:
                responses = intent.get('responses', [])
                if responses:
                    return np.random.choice(responses)
        
        return "I'm not sure how to help with that. Could you rephrase?"
    
    def get_action(self, tag):
        """Get the action associated with an intent"""
        for intent in self.intents['intents']:
            if intent['tag'] == tag:
                return intent.get('action')
        
        return None
    
    def extract_entities(self, user_input):
        """Extract entities like team names, player names from input"""
        entities = {
            'team': None,
            'tournament': None,
            'player': None
        }
        
        # Team patterns
        teams = [
            'india', 'pakistan', 'australia', 'england', 'new zealand',
            'south africa', 'west indies', 'bangladesh', 'sri lanka',
            'afghanistan', 'ireland', 'zimbabwe', 'netherlands'
        ]
        
        # Tournament patterns
        tournaments = [
            'ipl', 'world cup', 't20 world cup', 'odi world cup',
            'champions trophy', 'asia cup', 'big bash', 'cpl',
            'psl', 'bpl', 'lpl', 'the hundred'
        ]
        
        user_input_lower = user_input.lower()
        
        # Extract team
        for team in teams:
            if team in user_input_lower:
                entities['team'] = team.title()
                break
        
        # Extract tournament
        for tournament in tournaments:
            if tournament in user_input_lower:
                entities['tournament'] = tournament.upper() if len(tournament) <= 3 else tournament.title()
                break
        
        return entities
