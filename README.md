# Real-time Visualizer
This is a project I made in a week to get a better understanding of WebSockets protocol and the D3.js library. It features real-time processing of video input through the webcam and visualization of data. The data might be either the heat map of the face on video on the frame, the estimated distance of the face to the screen overtime (simulated data), or the emotions detected from the face over time (simulated data).

## Tech Stack
- React + Vite
- Material UI
- D3.js
- WebSockets protocol
- Node.js
- Python
- TensorFlow.js
- Docker

## Architecture
![RealtimeVisualizerSystemDesign](https://github.com/user-attachments/assets/161f56b9-6563-46b8-b5a3-429afcc02195)

The application follows a client-server architecture, where the client is a React web application that communicates with a Node.js server using WebSockets. The client sends a frame of the live video stream to the server as a base 64 image through the WebSocket connection every second. The message sent to the serve also has the type of processing that the client expects (heat map, face distance, or emotion detection).
The server processes the incoming frames and performs the requested analysis using Python scripts written with OpenCV and TensorFlow.js. The processed data is then sent back to the client a JSON formatted to be compatible with D3.js charts. The client receives the processed data and updates the visualizations in real-time.

The heat map is the only visualization that uses real data from the frames sent by the client, whereas the face distance and emotion detection visualizations are entirely simulated by the server. This is because of the processing complexity and lack of time -- I made this project in a week only for understanding the WebSockets protocol and the D3.js library. In the future, I plan to implement the face distance and emotion detection visualizations with real data as well.

However, this is not the ideal architecture for a production system. The most efficient way to implement this system would be through edge inference, that is, running the machine learning models directly in the browser instead of in the server. The reason I chose this inneficient design was because I wanted to use WebSockets for something.

## How to run

### Running the source code

After cloning the project, you must run each end separately. To run the frontend from the root directory:

```
cd realtime-visualizer
npm install
npm run dev
```
To run the backend from the root directory:

```
cd server
npm install
node server.js
```

**Note**: The backend need Python3 and some pip packages to run correctly. These are the packages you must have installed with pip beforehand:
- numpy
- opencv-python-headless
  
### Running the Docker image
First, pull the image from Docker Hub:

```
docker pull vinsouza/realtime-visualization:latest
```

Next, run the image with two ports: 5173 (frontend) and 8080 (backend)

```
docker run -p 5173:5173 -p 8080:8080 vinsouza/realtime-visualization
```


