import sys
import base64
import cv2
import numpy as np
import json

def read_stdin():
    return sys.stdin.read()

def decode_image(base64_string):
    try:
        image_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(json.dumps({"error": str(e), "facePoints": None}))
        sys.exit(1)

def detect_faces(img):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    face_points = [{"x": int(x + w / 2), "y": int(y + h / 2)} for (x, y, w, h) in faces]
    return face_points

if __name__ == "__main__":
    base64_image = read_stdin()
    img = decode_image(base64_image)
    if img is None:
        print(json.dumps({"error": "Image decode failed", "facePoints": None}))
        sys.exit(1)

    face_points = detect_faces(img)
    print(json.dumps({"facePoints": face_points}))

