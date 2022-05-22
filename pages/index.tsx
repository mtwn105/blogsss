import {
  Alert,
  AlertColor,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
import axios from "axios";

const Home: NextPage = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [devToApiKey, setDevToApiKey] = useState("");
  const [hashnodeApiKey, setHashnodeApiKey] = useState("");
  const [mediumApiKey, setMediumApiKey] = useState("");
  const [devToChecked, setDevToChecked] = useState(true);
  const [hashnodeChecked, setHashnodeChecked] = useState(true);
  const [mediumChecked, setMediumChecked] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Blog Published Successfully to "
  );
  const [snackbarType, setSnackbarType] = useState("success");

  const handleSnackbarClick = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleDevToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevToChecked(event.target.checked);
  };

  const handleHashnodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHashnodeChecked(event.target.checked);
  };

  const handleMediumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMediumChecked(event.target.checked);
  };

  const publishBlog = async () => {
    const request = {
      title: title,
      tags: tags,
      content: value,
    };

    console.log(JSON.stringify(request));

    if (devToChecked) {
      request.devToApiKey = devToApiKey;

      try {
        const response = await axios.post("/api/publish/devto", request);

        console.log(response.data);
        setSnackbarMessage(
          "Blog Published Successfully to Dev.to: " + response.data.url
        );
        setSnackbarType("success");
        setSnackbarOpen(true);
      } catch (err) {
        console.log(err);
        setSnackbarMessage(
          "Error while publishing to Dev.To: " + err.response.data.message
        );
        setSnackbarType("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditorChange = (value: any) => {
    setValue(value.text);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Blogsss</title>
        <meta
          name="description"
          content="Publish articles on multiple blogs!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography variant="h1" className={styles.heading} component="div">
          Blogsss
        </Typography>

        <Typography variant="h4" gutterBottom component="div">
          Publish blogs to multiple Platforms!
        </Typography>

        <Typography variant="h6" gutterBottom component="div">
          Hashnode | Dev.to | Medium
        </Typography>

        <Typography variant="subtitle1" gutterBottom component="div">
          Get started by writing blog in text editor below
        </Typography>

        <Box
          sx={{
            width: "100%",
            margin: "1 rem",
          }}
          mb={2}
        >
          <TextField
            inputProps={{ style: { fontSize: 40, fontWeight: 800 } }}
            InputLabelProps={{ style: { fontSize: 25 } }}
            className={styles.titleField}
            variant="standard"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            label="Blog Title"
            id="title"
          />
        </Box>

        <MdEditor
          style={{ width: "100%", height: "500px", margin: "1rem" }}
          renderHTML={(text) => <ReactMarkdown children={text} />}
          onChange={handleEditorChange}
        />

        <Typography variant="h6" gutterBottom component="div">
          Tags
        </Typography>

        <Box
          sx={{
            width: "100%",
            margin: "1 rem",
          }}
          mb={2}
        >
          <TextField
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            fullWidth
            label="Tags (seperated by comma, without spaces)"
            id="tags"
          />
        </Box>

        <Typography variant="h6" gutterBottom component="div">
          Publish To
        </Typography>
        <FormGroup row={true}>
          <FormControlLabel
            control={
              <Checkbox checked={devToChecked} onChange={handleDevToChange} />
            }
            label="Dev.To"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hashnodeChecked}
                onChange={handleHashnodeChange}
              />
            }
            label="Hashnode"
          />
          <FormControlLabel
            control={
              <Checkbox checked={mediumChecked} onChange={handleMediumChange} />
            }
            label="Medium"
          />
        </FormGroup>

        <Typography variant="h6" gutterBottom component="div">
          API Keys
        </Typography>

        {devToChecked && (
          <Box
            sx={{
              width: "100%",
              margin: "1 rem",
            }}
            mb={2}
          >
            <TextField
              value={devToApiKey}
              onChange={(event) => setDevToApiKey(event.target.value)}
              fullWidth
              label="Dev.To API Key"
              id="devto"
            />
          </Box>
        )}

        {hashnodeChecked && (
          <Box
            sx={{
              width: "100%",
              margin: "1 rem",
            }}
            mb={2}
          >
            <TextField
              value={hashnodeApiKey}
              onChange={(event) => setHashnodeApiKey(event.target.value)}
              fullWidth
              label="Hashnode API Key"
              id="hashnode"
            />
          </Box>
        )}

        {mediumChecked && (
          <Box
            sx={{
              width: "100%",
              margin: "1 rem",
            }}
            mb={2}
          >
            <TextField
              value={mediumApiKey}
              onChange={(event) => setMediumApiKey(event.target.value)}
              fullWidth
              label="Medium API Key"
              id="devto"
            />
          </Box>
        )}

        <Button
          onClick={publishBlog}
          variant="contained"
          color="success"
          size="large"
          disabled={
            !title ||
            !value ||
            (!devToChecked && !hashnodeChecked && !mediumChecked) ||
            (devToChecked && !devToApiKey) ||
            (hashnodeChecked && !hashnodeApiKey) ||
            (mediumChecked && !mediumApiKey)
          }
        >
          Publish
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarType as AlertColor}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/mtwn105"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made with 💖 by Amit Wani
        </a>
      </footer>
    </div>
  );
};

export default Home;
