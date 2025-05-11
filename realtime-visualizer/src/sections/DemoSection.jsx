import React, { useRef, useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // For responsive layout
import WhatshotIcon from "@mui/icons-material/HeatPump"; // heatmap
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import "./DemoSection.css";
import { updatePieChartData, updateLineChartData } from "../utils";
import Heatmap from "../components/Heatmap";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import ErrorMessage from "../components/ErrorMessage";

const VISUALIZATIONS = {
  HEATMAP: "heatmap",
  LINE: "line",
  PIE: "pie",
};
const visualizationDescription = {
  [VISUALIZATIONS.HEATMAP]:
    "This visualization shows the heatmap of the detected face in real-time.",
  [VISUALIZATIONS.LINE]:
    "This line chart shows the distance between the detected face to the screen over time. (simulated data)",
  [VISUALIZATIONS.PIE]:
    "This pie chart shows the distribution of emotions detected in real-time. (simulated data)",
};

const DemoSection = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [connectionError, setConnectionError] = useState(false);
  const [piechartData, setPiechartData] = useState([]);
  const [linechartData, setLinechartData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const [selectedVis, setSelectedVis] = useState(VISUALIZATIONS.HEATMAP);

  const handleVisChange = (_, newVis) => {
    if (newVis !== null) {
      setSelectedVis(newVis);
      setHeatmapData([]); // Reset heatmap data when changing visualization
      setPiechartData([]); // Reset pie chart data when changing visualization
      setLinechartData([]); // Reset line chart data when changing visualization
    }
  };
  // Add char resize event listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Initial resize
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Components resize
  useEffect(() => {
    if (windowWidth < 480) {
      setIsMobile(true);
    } else if (isMobile) {
      setIsMobile(false);
    }
    if (windowWidth < 720) {
      let newWidth = windowWidth * 0.75;
      setWidth(newWidth);
      setHeight((newWidth * 9) / 16); // Maintain 16:9 aspect ratio
    } else {
      setWidth(640);
      setHeight(480);
    }
  }, [windowWidth]);

  const onMessageCallback = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data) {
        switch (data.type) {
          case VISUALIZATIONS.HEATMAP:
            setHeatmapData((prev) => [...prev, data.data]);
            break;
          case VISUALIZATIONS.PIE:
            setPiechartData((prevData) =>
              updatePieChartData(prevData, data.data.facePoints)
            );
            break;
          case VISUALIZATIONS.LINE:
            setLinechartData((prevData) =>
              updateLineChartData(prevData, data.data.facePoints)
            );
            break;
          default:
            console.warn("No matching visualization type");
        }
      }
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: "user", // Front camera
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for video to be ready to play
          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              .play()
              .then(() => {
                console.log("Video is now playing");
                setIsStreaming(true);
              })
              .catch((err) => console.error("Error playing video:", err));
          };
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    initCamera();

    // Initialize WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    wsRef.current.onmessage = (event) => onMessageCallback(event);

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      // Cleanup
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }

      // Stop all video tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureAndSendFrame = () => {
    if (
      !videoRef.current ||
      videoRef.current.readyState !== 4 || // HAVE_ENOUGH_DATA
      !videoRef.current.videoWidth
    ) {
      console.warn("Video not ready for capture");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    try {
      // Get the base64 data
      const base64Image = canvas.toDataURL("image/jpeg", 0.8);
      const base64Data = base64Image.split(",")[1];

      // Send to server if connection is open
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        if (connectionError) {
          setConnectionError(false);
        }
        wsRef.current.send(
          JSON.stringify({ type: selectedVis, data: base64Data })
        );
      } else {
        console.warn("WebSocket not ready, state:", wsRef.current?.readyState);
        setConnectionError(true);
      }
    } catch (err) {
      console.error("Error capturing/sending frame:", err);
    }
  };

  // Set up frame capture only when video is streaming
  // Combined useEffect that handles both streaming state and visualization type changes
  useEffect(() => {
    if (!isStreaming) return;

    console.log(`Setting up interval for visualization type: ${selectedVis}`);

    // Clear any existing interval first
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    // Set up a new interval with the current visualization type
    frameIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, 1000);
    setIsCapturing(true);

    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, [isStreaming, selectedVis]);

  const ToggleRecordingButton = () => {
    const handleToggleRecording = () => {
      if (frameIntervalRef.current) {
        if (isCapturing) {
          console.log("Clearing interval");
          clearInterval(frameIntervalRef.current);
          frameIntervalRef.current = null;
        }
      } else {
        console.log("Setting up interval");
        frameIntervalRef.current = setInterval(() => {
          captureAndSendFrame();
        }, 1000);
      }
      setIsCapturing(!isCapturing);
    };

    return (
      <button
        onClick={handleToggleRecording}
        className={isCapturing ? "stop-button" : "start-button"}
      >
        {isCapturing ? (
          <PauseIcon style={{ fontSize: 50 }} />
        ) : (
          <PlayArrowIcon style={{ fontSize: 50 }} />
        )}
        <br />
        {`${isCapturing ? "Stop" : "Start"} Capturing`}
      </button>
    );
  };
  return (
    <Grid
      id="main"
      container
      direction={"row"}
      spacing={2}
      style={{ width: "100%", justifyContent: "center" }}
    >
      <Grid
        item
        xs={12}
        md={6}
        style={{ position: "relative", width, height }}
        className="video-wrapper"
      >
        {/* Actual webcam feed */}
        <video
          ref={videoRef}
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            objectFit: "cover",
          }}
          autoPlay
          playsInline
          muted
          className={`${selectedVis}-video`}
        />
        {/* Semi-transparent overlay */}
        <div className="video-overlay">
          {selectedVis == VISUALIZATIONS.HEATMAP && (
            <Heatmap data={heatmapData} width={width} height={height} />
          )}
        </div>
      </Grid>
      <Grid
        xs={12}
        md={6}
        container
        direction={isMobile ? "column-reverse" : "column"}
        width={width}
        height={"100%"}
        className="visualization-options-wrapper"
      >
        <ToggleButtonGroup
          orientation={isMobile ? "vertical" : "horizontal"}
          value={selectedVis}
          exclusive
          onChange={handleVisChange}
          fullWidth
        >
          <ToggleButton
            className="option-button"
            value={VISUALIZATIONS.HEATMAP}
          >
            <WhatshotIcon sx={{ marginRight: 1 }} />
            <label>Heatmap</label>
          </ToggleButton>
          <ToggleButton className="option-button" value={VISUALIZATIONS.LINE}>
            <BarChartIcon sx={{ marginRight: 1 }} />
            <label>Face Distance</label>
          </ToggleButton>
          <ToggleButton className="option-button" value={VISUALIZATIONS.PIE}>
            <PieChartIcon sx={{ marginRight: 1 }} />
            <label>Emotions</label>
          </ToggleButton>
        </ToggleButtonGroup>
        <div>
          <Grid
            container
            sx={{
              flexGrow: 1,
              overflow: "auto",
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: 255,
            }}
          >
            {connectionError && <ErrorMessage />}
            {selectedVis == VISUALIZATIONS.HEATMAP && !connectionError && (
              <ToggleRecordingButton />
            )}
            {selectedVis == VISUALIZATIONS.PIE && !connectionError && (
              <PieChart
                data={piechartData}
                containerWidth={width}
                containerHeight={height}
              />
            )}

            {selectedVis == VISUALIZATIONS.LINE && !connectionError && (
              <LineChart data={linechartData} />
            )}
          </Grid>
          <Grid
            container
            sx={{
              flexGrow: 0,
              padding: 2,
              display: connectionError ? "none" : "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="visualization-description"
          >
            <Typography width="75%" variant="body1">
              {visualizationDescription[selectedVis]}
            </Typography>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default DemoSection;
