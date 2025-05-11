#!/usr/bin/env python
import sys
import json
import base64
import os
import traceback
import random
import time

# Create a log file for debugging
log_file = open("emotions_log.txt", "w")
def log(message):
    log_file.write(f"{message}\n")
    log_file.flush()  # Make sure it's written immediately
    print(f"DEBUG: {message}", file=sys.stderr)  # Also write to stderr for Node.js console

# List of possible emotions with their likelihoods (used for simulation)
POSSIBLE_EMOTIONS = [
    {"label": "neutral", "likelihood": 30},
    {"label": "happy", "likelihood": 20},
    {"label": "sad", "likelihood": 10},
    {"label": "angry", "likelihood": 5},
    {"label": "surprised", "likelihood": 15},
    {"label": "fearful", "likelihood": 5},
    {"label": "disgusted", "likelihood": 5}
]

# Basic fallback response - a neutral emotion with low confidence
# This will be used if no emotions are detected or an error occurs
FALLBACK_RESPONSE = [
    {"label": "neutral", "value": 1}
]

def simulate_emotion_detection(image_bytes=None):
    """
    Simulates emotion detection when DeepFace is not used.
    Returns a list of detected emotions with their confidence values.
    """
    try:
        # Seed random with the current time to get different results each run
        random.seed(time.time())
        
        # Determine how many emotions to detect (1-3)
        num_emotions = random.choices([1, 2, 3], weights=[60, 30, 10])[0]
        
        # Randomly select emotions based on their likelihoods
        emotion_weights = [emotion["likelihood"] for emotion in POSSIBLE_EMOTIONS]
        selected_emotions = random.choices(
            POSSIBLE_EMOTIONS, 
            weights=emotion_weights, 
            k=num_emotions
        )
        
        # Remove duplicates (in case the same emotion was selected multiple times)
        unique_emotions = []
        seen_labels = set()
        for emotion in selected_emotions:
            if emotion["label"] not in seen_labels:
                seen_labels.add(emotion["label"])
                unique_emotions.append(emotion)
        
        # Generate confidence values (1-10) for each emotion
        result = []
        for emotion in unique_emotions:
            # Higher likelihood emotions tend to have higher values
            base_confidence = random.randint(1, 10)
            boost = random.randint(0, 5) if emotion["likelihood"] > 15 else 0
            confidence = min(10, base_confidence + boost)
            
            result.append({
                "label": emotion["label"],
                "value": confidence
            })
        
        log(f"Simulated emotion detection: {result}")
        return result
        
    except Exception as e:
        log(f"Error in emotion simulation: {str(e)}")
        return FALLBACK_RESPONSE

try:
    log(f"Script started. CWD: {os.getcwd()}")
    
    # Read from stdin
    log("Reading from stdin...")
    base64_string = sys.stdin.read()
    log(f"Read {len(base64_string)} characters from stdin")
    
    try:
        # Decode the base64 image
        image_bytes = base64.b64decode(base64_string)
        log(f"Successfully decoded base64 to {len(image_bytes)} bytes")
        
        # Simulate emotion detection (replace this with DeepFace in production)
        detected_emotions = simulate_emotion_detection(image_bytes)
        
        # If no emotions were detected, use the fallback
        if not detected_emotions:
            log("No emotions detected, using fallback")
            detected_emotions = FALLBACK_RESPONSE
            
        # Prepare and send the response
        response = {"facePoints": detected_emotions}
        log(f"Sending emotion response: {json.dumps(response)}")
        print(json.dumps(response))
        sys.stdout.flush()
        
    except Exception as e:
        log(f"Error processing image: {str(e)}")
        log(traceback.format_exc())
        # Send fallback response on error
        print(json.dumps({"facePoints": FALLBACK_RESPONSE}))
        sys.stdout.flush()

except Exception as e:
    log(f"Unexpected error: {str(e)}")
    log(traceback.format_exc())
    # Try to output a fallback response
    try:
        print(json.dumps({"facePoints": FALLBACK_RESPONSE}))
        sys.stdout.flush()
    except:
        pass

finally:
    log("Script completed")
    log_file.close()