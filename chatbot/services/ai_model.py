"""Minimal AIModel stub for chatbot.services.

This provides a safe, dependency-free fallback implementation so
`ResponseGenerator` can import `AIModel` at runtime. It intentionally
returns `None` for `generate_response` so existing intent-based
responses are preserved unless `use_ai=True` and a future real AI is
plugged in.
"""

from typing import Optional

class AIModel:
    def __init__(self, *args, **kwargs):
        # Placeholder constructor for any future configuration
        pass

    def generate_response(self, prompt: str) -> Optional[str]:
        """Return an AI-enhanced response for `prompt` or `None` if none.

        Current stub returns `None` to preserve rule-based responses.
        Replace with a real model integration when available.
        """
        return None
