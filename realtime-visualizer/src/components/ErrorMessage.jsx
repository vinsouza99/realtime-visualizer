import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import "./ErrorMessage.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import WebsocketError from "../assets/websocket-error.png";
import { useTheme } from "@mui/material";

const ErrorMessage = () => {
  const theme = useTheme();
  return (
    <Grid
      container
      className="error-message"
      direction="column"
      alignItems="center"
      spacing={5}
      margin={5}
    >
      <Grid item xs={12} className="error-message-content">
        <img
          src={WebsocketError}
          alt="WebSocker Error"
          style={{
            width: "100%",
            maxWidth: 200,
            height: "auto",
            marginBottom: 10,
            opacity: 0.9,
          }}
        />
      </Grid>
      <Grid item xs={12} className="error-message-content">
        <Typography
          variant="body1"
          display={"flex"}
          alignItems="center"
          marginBottom={3}
          color={theme.palette.secondary.main}
        >
          There was a web socket connection error!
        </Typography>
        <Button
          id="refresh-button"
          variant="contained"
          marginTop={10}
          className="error-message-button"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon />
          &nbsp;
          <span>Refresh</span>
        </Button>
      </Grid>
    </Grid>
  );
};

export default ErrorMessage;
