import requests

class GeminiService:
    
    @staticmethod
    def get_ai_response(question: str, context: str = None) -> str:
        """Get AI response from Gemini using REST API"""
        
        # Your API key
        api_key = "AIzaSyAWWYKMr_mGm3iCHBgB9CPjVmlj2rYXMjg"
        
        try:
            # Prepare prompt
            prompt = f"""You are a helpful AI tutor for students.

Student Question: {question}

Provide a clear, concise, and educational response suitable for a student. Keep it simple and easy to understand."""
            
            # Correct payload format
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            }
            
            # Use gemini-2.5-flash (confirmed available in your account)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            
            headers = {"Content-Type": "application/json"}
            
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'candidates' in data and len(data['candidates']) > 0:
                    text = data['candidates'][0]['content']['parts'][0]['text']
                    return text
                else:
                    return "The AI couldn't generate a response. Try rephrasing your question."
            else:
                return f"Error: {response.status_code}. Please try again."
            
        except Exception as e:
            return f"Connection error: {str(e)}"