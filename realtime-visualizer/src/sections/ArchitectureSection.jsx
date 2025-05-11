import { Typography, Grid, useTheme } from "@mui/material";

const ArchitectureSection = () => {
  const theme = useTheme();

  return (
    <section
      id="system-architecture"
      style={{
        padding: 10,
        paddingTop: theme.spacing(10),
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        System Architecture
      </Typography>

      <Grid
        container
        direction="row"
        spacing={3}
        marginTop={5}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Grid
          item
          xs={12}
          md={6}
          className="blurred-background"
          justifyContent={"center"}
          alignContent={"center"}
          style={{
            borderRadius: 20,
            boxShadow: "0 4px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <img
            src="/assets/system-design.png"
            alt="System Architecture"
            style={{
              width: "100%",
              maxWidth: 700,
              height: "auto",
              marginBottom: theme.spacing(2),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} maxWidth={500} textAlign={"left"}>
          <Typography variant="body1" color="text.secondary">
            The application follows a client-server architecture, where the
            client is a React web application that communicates with a Node.js
            server using WebSockets. The client sends a frame of the live video
            stream to the server as a base 64 image through the WebSocket
            connection every second. The message sent to the serve also has the
            type of processing that the client expects (heat map, face distance,
            or emotion detection).
            <br />
            <br />
            The server processes the incoming frames and performs the requested
            analysis using Python scripts written with OpenCV and TensorFlow.js.
            The processed data is then sent back to the client a JSON formatted
            to be compatible with D3.js charts. The client receives the
            processed data and updates the visualizations in real-time.
            <br />
            <br />
            The heat map is the only visualization that uses real data from the
            frames sent by the client, whereas the face distance and emotion
            detection visualizations are entirely simulated by the server. This
            is because of the processing complexity and lack of time -- I made
            this project in a week only for understanding the WebSockets
            protocol and the D3.js library. In the future, I plan to implement
            the face distance and emotion detection visualizations with real
            data as well.
            <br />
            <br />
            However, this is not the ideal architecture for a production system.
            The most efficient way to implement this system would be through
            edge inference, that is, running the machine learning models
            directly in the browser instead of in the server. The reason I chose
            this inneficient design was because I wanted to use WebSockets for
            something.
          </Typography>
        </Grid>
      </Grid>
    </section>
  );
};

export default ArchitectureSection;
