
from .intent_classifier import IntentClassifier
import importlib

# Robust dynamic import for AIModel: try relative, package-qualified, then top-level
AIModel = None
for mod_name, pkg in (('.ai_model', __package__), ('chatbot.services.ai_model', None), ('ai_model', None)):
    try:
        if mod_name.startswith('.') and pkg:
            module = importlib.import_module(mod_name, package=pkg)
        else:
            module = importlib.import_module(mod_name)
        AIModel = getattr(module, 'AIModel')
        break
    except Exception:
        AIModel = None
if AIModel is None:
    raise ImportError("Could not import AIModel from '.ai_model', 'chatbot.services.ai_model', or 'ai_model'")

from cricket.services import CricAPIService, YouTubeService
import logging

logger = logging.getLogger(__name__)

class ResponseGenerator:
    """Generate appropriate responses based on user intent"""
    
    def __init__(self):
        self.intent_classifier = IntentClassifier()
        self.ai_model = AIModel()
        self.cricapi = CricAPIService()
        self.youtube = YouTubeService()
    
    def generate_response(self, user_input, use_ai=False):
        """Generate response for user input"""
        # Classify intent
        intent_tag, confidence = self.intent_classifier.classify(user_input)
        
        logger.info(f"Intent: {intent_tag}, Confidence: {confidence}")
        
        # Get action if any
        action = self.intent_classifier.get_action(intent_tag)
        
        # Extract entities
        entities = self.intent_classifier.extract_entities(user_input)
        
        # Get intent-based response
        response = self.intent_classifier.get_response(intent_tag)
        
        # Execute action if available
        action_data = None
        if action:
            action_data = self.execute_action(action, entities)
        
        # Use AI model for fallback or enhancement
        if use_ai and (intent_tag == 'fallback' or confidence < 0.5):
            ai_response = self.ai_model.generate_response(user_input)
            if ai_response:
                response = ai_response
        
        return {
            'response': response,
            'intent': intent_tag,
            'confidence': float(confidence),
            'action': action,
            'action_data': action_data,
            'entities': entities
        }
    
    def execute_action(self, action, entities):
        """Execute action based on intent"""
        try:
            if action == 'get_live_matches':
                matches = self.cricapi.get_current_matches()
                return {'matches': matches[:5]} if matches else None
            
            elif action == 'get_streams':
                query = f"{entities.get('team', 'cricket')} live"
                streams = self.youtube.search_live_streams(query, max_results=5)
                return {'streams': streams} if streams else None
            
            elif action == 'search_team':
                team = entities.get('team')
                if team:
                    matches = self.cricapi.get_current_matches()
                    team_matches = [
                        m for m in matches
                        if team.lower() in m.get('name', '').lower()
                    ]
                    return {'matches': team_matches[:5]} if team_matches else None
            
            elif action == 'get_tournament_info':
                tournament = entities.get('tournament')
                if tournament:
                    streams = self.youtube.search_tournament_streams(tournament)
                    return {'streams': streams[:5]} if streams else None
            
            elif action == 'get_score':
                matches = self.cricapi.get_current_matches()
                if matches:
                    live_matches = [m for m in matches if m.get('status') == 'Live']
                    if live_matches:
                        return {'matches': live_matches[:3]}
            
            return None
        
        except Exception as e:
            logger.error(f"Action execution failed: {str(e)}")
            return None
