#!/usr/bin/env python
import sys
import json
import base64
import random
import time
import os
import traceback
import datetime

# Create a log file for debugging
log_file = open("distance_log.txt", "w")
def log(message):
    log_file.write(f"{message}\n")
    log_file.flush()  # Make sure it's written immediately
    print(f"DEBUG: {message}", file=sys.stderr)  # Also write to stderr for Node.js console

# Constants for distance simulation
MIN_DISTANCE = 30  # Minimum face distance in cm
MAX_DISTANCE = 90  # Maximum face distance in cm
OPTIMAL_DISTANCE = 50  # Ideal distance from screen in cm
DISTANCE_VARIATION = 5  # How much the distance typically varies between readings

# Parameters for simulation patterns
TREND_CHANCE = 0.3  # Chance of starting a movement trend
MAX_TREND_STEPS = 8  # Maximum steps in a trend movement
TREND_STRENGTH = 0.7  # How strongly the trend affects movement (0-1)

# State variables for simulation
last_distance = OPTIMAL_DISTANCE  # Start at optimal distance
trend_direction = 0  # 0 = no trend, 1 = moving closer, -1 = moving away
trend_steps_left = 0  # How many more steps in current trend

def simulate_face_distance(image_bytes=None):
    """
    Simulates detecting the distance of a face from the screen
    Returns a distance value in centimeters
    """
    global last_distance, trend_direction, trend_steps_left
    
    try:
        # If we're not in a trend, maybe start one
        if trend_steps_left <= 0 and random.random() < TREND_CHANCE:
            # Start a new trend
            trend_direction = random.choice([-1, 1])  # -1 = moving away, 1 = moving closer
            trend_steps_left = random.randint(3, MAX_TREND_STEPS)
            log(f"Starting new trend: {'moving closer' if trend_direction > 0 else 'moving away'} for {trend_steps_left} steps")
        
        # Calculate base movement (random walk)
        random_movement = random.normalvariate(0, DISTANCE_VARIATION)
        
        # Apply trend if active
        trend_movement = 0
        if trend_steps_left > 0:
            # Determine how much the trend contributes to movement
            trend_intensity = TREND_STRENGTH * DISTANCE_VARIATION * 1.5
            # Trend direction determines sign
            trend_movement = trend_direction * trend_intensity
            trend_steps_left -= 1
            
            # If trend ended, log it
            if trend_steps_left <= 0:
                log("Trend movement completed")
                trend_direction = 0
        
        # Apply both movements
        new_distance = last_distance + random_movement + trend_movement
        
        # Enforce boundaries
        new_distance = max(MIN_DISTANCE, min(MAX_DISTANCE, new_distance))
        
        # Update last distance for next call
        last_distance = new_distance
        
        # Add a bit of noise
        noisy_distance = new_distance * (1 + random.normalvariate(0, 0.02))
        
        # Round to 1 decimal place
        result = round(noisy_distance, 1)
        
        log(f"Simulated distance: {result} cm")
        return result
        
    except Exception as e:
        log(f"Error in distance simulation: {str(e)}")
        return OPTIMAL_DISTANCE  # Return safe default value

# Maintain a history of readings to return
distance_history = []
MAX_HISTORY_LENGTH = 30  # How many readings to keep

def format_timestamp():
    """Format current time as ISO string for frontend compatibility"""
    return datetime.datetime.now().isoformat()

try:
    log(f"Face distance script started. CWD: {os.getcwd()}")
    
    # Read from stdin
    log("Reading from stdin...")
    base64_string = sys.stdin.read()
    log(f"Read {len(base64_string)} characters from stdin")
    
    try:
        # Decode the base64 image
        image_bytes = base64.b64decode(base64_string)
        log(f"Successfully decoded base64 to {len(image_bytes)} bytes")
        
        # Simulate distance detection
        current_distance = simulate_face_distance(image_bytes)
        
        # Add latest reading to history with timestamp
        new_reading = {
            "timestamp": format_timestamp(),
            "distance": current_distance
        }
        distance_history.append(new_reading)
        
        # Trim history if needed
        if len(distance_history) > MAX_HISTORY_LENGTH:
            distance_history = distance_history[-MAX_HISTORY_LENGTH:]
        
        # Prepare and send the response
        response = {"facePoints": distance_history}
        log(f"Sending distance response with {len(distance_history)} readings")
        print(json.dumps(response))
        sys.stdout.flush()
        
    except Exception as e:
        log(f"Error processing image: {str(e)}")
        log(traceback.format_exc())
        # Send fallback response with just the last reading or a default
        if not distance_history:
            fallback_reading = {
                "timestamp": format_timestamp(),
                "distance": OPTIMAL_DISTANCE
            }
            fallback_response = {"facePoints": [fallback_reading]}
        else:
            fallback_response = {"facePoints": distance_history}
            
        print(json.dumps(fallback_response))
        sys.stdout.flush()

except Exception as e:
    log(f"Unexpected error: {str(e)}")
    log(traceback.format_exc())
    # Try to output a minimal fallback response
    try:
        fallback_reading = {
            "timestamp": format_timestamp(),
            "distance": OPTIMAL_DISTANCE
        }
        fallback_response = {"facePoints": [fallback_reading]}
        print(json.dumps(fallback_response))
        sys.stdout.flush()
    except:
        pass

finally:
    log("Script completed")
    log_file.close()