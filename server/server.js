/**
 *1.The Node.js WebSocket server receives frames from the frontend (base64 images).
  2. A Python script with OpenCV processes those frames and detects the face(s).
  3. The server sends back metadata (like face center coordinates) over the WebSocket.
 */
const WebSocket = require("ws");
const path = require("path");

const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    const type = parsedMessage.type;
    const base64Image = parsedMessage.data;

    if (!type || !base64Image) {
      console.error("Missing type or image data");
      return;
    }
    let pythonScript;
    switch (type) {
      case "heatmap":
        pythonScript = "face_detector.py";
        break;
      case "pie":
        pythonScript = "emotions_detector.py";
        break;
      case "line":
        pythonScript = "face_distance_estimator.py";
        break;
      default:
        console.error("Unknown service type:", type);
        return;
    }
    // Check if the message is a base64 image
    if (!base64Image) {
      console.error("Invalid base64 image received");
      return;
    }
    const { spawn } = require("child_process");
    const python = spawn("python3", [pythonScript], {
      cwd: path.join(__dirname), // the directory of server.js
    });
    python.stdin.write(base64Image);
    python.stdin.end();

    let stdoutData = "";
    let stderrData = "";

    python.stdout.on("data", (data) => {
      stdoutData += data.toString();
      console.log(
        `Python stdout chunk: ${data.toString().substring(0, 50)}...`
      );
    });

    python.stderr.on("data", (data) => {
      stderrData += data.toString();
      console.error(`Python stderr: ${data.toString()}`);
    });

    python.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);

      if (code !== 0) {
        console.error("Python script error:", stderrData);
        // Send error to client
        ws.send(JSON.stringify({ error: "Processing failed" }));
        return;
      }

      if (!stdoutData.trim()) {
        console.error("Empty result from Python script");
        return;
      }

      try {
        const json = JSON.parse(stdoutData);
        // Send the JSON result back to the client
        const output = { type: type, data: json };
        console.log("Sending result to client:", output);
        ws.send(JSON.stringify(output));
      } catch (e) {
        console.error("Failed to parse result:", stdoutData);
        console.error("Parse error:", e);
        // Send error to client
        ws.send(JSON.stringify({ error: "Failed to parse result" }));
      }
    });
  });
});
