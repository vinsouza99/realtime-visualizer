import { useEffect, useState } from "react";

export function useFaceSocket() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // { x: ..., y: ... }
        if (data && typeof data.x === "number" && typeof data.y === "number") {
          setPositions((prev) => [...prev, data]);
        }
      } catch (err) {
        console.log("Error parsing JSON:", err);
        console.error("Invalid JSON from server:", event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  return positions;
}
