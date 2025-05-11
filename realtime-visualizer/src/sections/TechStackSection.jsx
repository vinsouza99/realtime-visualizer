import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from "@mui/material";

const techStack = [
  {
    title: "React",
    description: "Frontend library for building UI components.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    title: "D3.js",
    description: "Powerful library for data-driven visualizations.",
    image: "https://d3js.org/logo.svg",
  },
  {
    title: "Material UI",
    description: "React components for faster and easier UI development.",
    image: "https://mui.com/static/logo.png",
  },
  {
    title: "TensorFlow",
    description: "End-to-end open-source machine learning platform.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
  },

  {
    title: "Node.js",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine.",
    image: "https://static.cdnlogo.com/logos/n/79/node-js.svg",
  },
  {
    title: "Python",
    description:
      "High-level programming language for general-purpose programming.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  },
  {
    title: "WebSocket",
    description:
      "Protocol for full-duplex communication channels over a single TCP connection.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/WebSocket_colored_logo.svg",
  },
];

const TechStackSection = () => {
  const theme = useTheme();

  return (
    <section
      id="tech-stack"
      style={{
        padding: 10,
        paddingTop: theme.spacing(10),
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Tech Stack
      </Typography>

      <Grid
        container
        spacing={2}
        marginTop={5}
        alignContent={"center"}
        justifyContent={"center"}
      >
        {techStack.map(({ title, description, image }) => (
          <Grid item xs={12} sm={6} md={4} key={title}>
            <Card
              className="blurred-background"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                maxWidth: 280,
              }}
            >
              <CardMedia
                component="img"
                image={image}
                alt={title}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  marginBottom: 2,
                }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" component="div">
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default TechStackSection;
