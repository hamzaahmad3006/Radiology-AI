import os
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

class AIService:
    @staticmethod
    def generate_explanation(prediction: str, confidence: float):
        prompt = f"""
        As a specialized radiologist assistant, provide a clear, empathetic, and professional explanation for a patient based on the following X-ray analysis result:
        Result: {prediction}
        Confidence Score: {confidence:.2f}
        
        The explanation should be easy to understand for a non-medical person, explain what the condition implies, and suggest general next steps (like consulting a doctor) without giving specific medical advice or prescriptions.
        Be extremely concise and to the point. Answer in exactly 2 short sentences.
        """
        
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional and empathetic radiologist assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Analysis complete. The scan shows patterns consistent with {prediction}. Please consult a healthcare professional for a detailed evaluation."

    @staticmethod
    def chat_assistant(question: str, scan_context: dict):
        prompt = f"""
        A patient is asking a question about their X-ray analysis result.
        Scan Result: {scan_context.get('prediction')}
        Confidence: {scan_context.get('confidence')}
        Explanation provided earlier: {scan_context.get('explanation')}
        
        Patient Question: {question}
        
        INSTRUCTIONS:
        1. Answer the question DIRECTLY and CONCISELY. Be "to the point."
        2. NO UNREQUESTED ADVICE: Do NOT suggest hospitals, cities, or medical facilities unless the user explicitly mentions a city or asks for recommendations.
        3. LOCATION SENSITIVITY: Only if the user mentions a specific city (e.g.Washington, New York, etc.) or asks for nearby hospitals, provide a direct answer for that location.
        4. Avoid generic AI templates or repetitive "For this condition..." phrases.
        5. Do NOT repeat the "consult your doctor" disclaimer in every message.
        6. Keep the response to 1-2 sentences. Sound like a senior professional.
        """
        
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a senior professional radiologist assistant. You provide surgical and direct answers. You avoid repetitive AI-style hedging and generic templates. You sound like an experienced human professional."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return "I'm sorry, I'm having trouble connecting to my knowledge base. Please consult with your doctor regarding your results."

    @staticmethod
    def analyze_vision(image_path: str):
        """
        Uses Vision AI to analyze ANY X-ray image.
        Returns identification, prediction, confidence, and explanation.
        """
        try:
            base64_image = encode_image(image_path)
            
            completion = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text", 
                                "text": """You are a Senior Radiology AI Expert. Your objective is a 100% accurate, high-sensitivity diagnostic analysis of this X-ray. You must NOT miss subtle fractures.

DIAGNOSTIC PROTOCOL:
1. SYSTEMATIC BONE SCAN: You must trace the entire edge (cortex) of EVERY bone shown. For Hands, trace all 5 metacarpals and EVERY phalanx (finger bone) from top to bottom.
2. FRACTURE IDENTIFICATION: Look for ANY break, notch, 'step-off', or thin dark line (lucency) crossing the bone. Fracture lines can be very thin and subtle.
3. HIGH-RISK AREAS: Pay extreme attention to the 5th metacarpal (pinky side) and the joints.
4. SENSITIVITY RULE: If you see ANY disruption in the smooth white outline of a bone, do NOT report it as 'Normal'. Even if you are only 70% sure, report it as a 'Fracture' or 'Suspected Fracture'.

Format your response strictly:
PART: [Body Part]
FINDING: [Diagnosis, e.g., 'Fracture of the 5th metacarpal distal shaft' or 'Normal']
CONFIDENCE: [0.0-1.0]
EXPLANATION: [List exactly which bone was traced and where the disruption was found. Be specific.]"""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}",
                                },
                            },
                        ],
                    }
                ],
                temperature=0.1, # Lower temperature for stable, consistent diagnostic reasoning
            )
            
            response = completion.choices[0].message.content.strip()
            
            # LOGGING: Save to a local file for debugging
            log_entry = f"\n--- {os.path.basename(image_path)} ---\n{response}\n------------------\n"
            log_file = "/tmp/vision_debug.log" if os.environ.get("VERCEL") else "vision_debug.log"
            with open(log_file, "a") as f:
                f.write(log_entry)
            print(f"Vision Log saved to {log_file}")

            # Parse response - robust parsing
            result = {
                "body_part": "Unknown",
                "prediction": "Normal",
                "confidence": 0.8,
                "explanation": response[:200]
            }
            
            for line in response.split('\n'):
                target = line.upper()
                if "PART:" in target:
                    result["body_part"] = line.split(":", 1)[1].strip()
                elif "FINDING:" in target:
                    result["prediction"] = line.split(":", 1)[1].strip()
                elif "CONFIDENCE:" in target:
                    try:
                        import re
                        match = re.search(r"(\d+\.?\d*)", line)
                        if match:
                            result["confidence"] = float(match.group(1))
                    except: pass
                elif "EXPLANATION:" in target:
                    result["explanation"] = line.split(":", 1)[1].strip()
            
            return result
        except Exception as e:
            print(f"Vision Analysis Error: {e}")
            return {
                "body_part": "Unknown",
                "prediction": "Error",
                "confidence": 0.0,
                "explanation": f"Vision AI Error: {str(e)}"
            }

    @staticmethod
    def validate_image(image_path: str):
        # We now accept all images, but still use this for logging
        result = AIService.analyze_vision(image_path)
        return True, f"Identified as {result['body_part']}"
