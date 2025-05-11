import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "../index.css"; // Import your CSS file

function ResponsiveAppBar() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const links = [
    { text: "Home", href: "#home" },
    { text: "Tech Stack", href: "#tech-stack" },
    { text: "System Architecture", href: "#system-architecture" },
    { text: "Source Code", href: "#source-code" },
  ];

  return (
    <AppBar
      id="toolbar"
      position="fixed"
      className="blurred-background"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        color: "black",
        boxShadow: 0,
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <img
            src="/assets/Logo.png" // Replace with your logo path
            alt="Logo"
            width={50}
            height={50}
          />

          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            Real-time Visualizer
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                width={200}
                role="presentation"
                onClick={() => setDrawerOpen(false)}
                paddingTop={10}
              >
                <List>
                  {links.map(({ text, href }) => (
                    <ListItem button component="a" href={href} key={text}>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box>
            {links.map(({ text, href }) => (
              <Button
                key={text}
                color="inherit"
                href={href}
                sx={{ marginLeft: 2 }}
              >
                {text}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
