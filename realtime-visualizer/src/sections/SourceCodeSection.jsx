import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const links = [
  {
    title: "GitHub",
    url: "https://github.com/vinsouza99",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
  },
  {
    title: "Docker Image",
    url: "https://github.com/vinsouza99",
    image:
      "https://raw.githubusercontent.com/withastro/docs/96f42b8019cb3e42acdf3cf43359c52f04db22b1/public/logos/docker.svg",
  },
];

const SourceCodeSection = () => {
  const theme = useTheme();

  return (
    <section
      id="source-code"
      style={{
        padding: 10,
        paddingTop: theme.spacing(10),
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginBottom: 50, marginTop: 50 }}
      >
        Source Code
      </Typography>

      <Grid
        container
        spacing={3}
        alignContent={"center"}
        justifyContent={"center"}
      >
        {links.map(({ title, url, image }) => (
          <Grid item xs={12} sm={6} md={4} key={title}>
            <a
              target="_blank"
              href={url}
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <Card
                className="blurred-background"
                sx={{
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 2,
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
                    margin: "auto",
                  }}
                />
                <CardContent
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" component="div">
                    {title}
                  </Typography>
                  <OpenInNewIcon />
                </CardContent>
              </Card>
            </a>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default SourceCodeSection;
