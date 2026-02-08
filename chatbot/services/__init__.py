
from .intent_classifier import IntentClassifier
from typing import TYPE_CHECKING

if TYPE_CHECKING:
	# Let type checkers know about AIModel without causing import-time errors.
	from .ai_model import AIModel  # type: ignore
else:
	try:
		import importlib
		_mod = importlib.import_module('.ai_model', package=__package__)
		AIModel = getattr(_mod, 'AIModel')
	except Exception:
		class AIModel:
			"""Fallback stub for AIModel when services/ai_model.py cannot be resolved."""
			def __init__(self, *args, **kwargs):
				pass

from .response_generator import ResponseGenerator

__all__ = ['IntentClassifier', 'AIModel', 'ResponseGenerator']