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
    description: "My library of choice for building user interfaces.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    title: "D3.js",
    description:
      "Powerful library for data-driven visualizations. It's my first attempt at using D3.js.",
    image: "https://d3js.org/logo.svg",
  },
  {
    title: "Material UI",
    description: "React components for faster and easier UI development.",
    image: "https://mui.com/static/logo.png",
  },
  {
    title: "TensorFlow",
    description:
      "End-to-end open-source machine learning platform. It is required for the Python scripts in the backend to run.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
  },

  {
    title: "Node.js",
    description: "My go-to for building scalable network applications.",
    image: "https://static.cdnlogo.com/logos/n/79/node-js.svg",
  },
  {
    title: "WebSocket",
    description:
      "Protocol for real-time communication between the client and server. It was also my first attempt at using WebSocket.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cd/WebSocket_colored_logo.svg",
  },
  {
    title: "Python",
    description:
      "Favourite programming language for data science and machine learning.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
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
              <CardContent sx={{ textAlign: "left" }}>
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
