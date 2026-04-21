import random
import time
import hashlib

class XRayService:
    @staticmethod
    def analyze_image(image_path: str):
        # Simulated AI model inference
        # In a real scenario, this would load a PyTorch/TensorFlow model
        time.sleep(2) # Simulate processing time
        
        # Make the prediction deterministic based on the file content
        with open(image_path, "rb") as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        
        # Use the hash as a seed for randomness
        random.seed(file_hash)
        
        conditions = ["Normal", "Pneumonia", "Tuberculosis", "Lung Opacity"]
        prediction = random.choice(conditions)
        confidence = random.uniform(0.75, 0.98)
        
        # Reset seed to avoid affecting other parts of the app
        random.seed(None)
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "heatmap_path": None 
        }
