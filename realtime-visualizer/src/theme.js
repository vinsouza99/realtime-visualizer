import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // mobile
      sm: 640, // tablet
      md: 1024, // laptop
      lg: 1200, // desktop
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: "#F16529", // custom orange
    },
    secondary: {
      main: "#3d1e00", // custom orange
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "inherit",
          "&:hover": {
            color: "#F16529",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&:hover": {
            color: "#F16529",
          },
        },
      },
    },
  },
});
