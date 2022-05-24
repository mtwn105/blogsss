import {
  Alert,
  AlertColor,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Tab,
  Tabs,
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
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import CreateIcon from "@mui/icons-material/Create";
import TuneIcon from "@mui/icons-material/Tune";
import PublishIcon from "@mui/icons-material/Publish";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

type PublishRequest = {
  title: string;
  content: string;
  tags: string;
  coverImage: string;
  devToApiKey: string;
  hashnodeApiKey: string;
  mediumApiKey: string;
  series: string;
};

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
  const [apiKeySnackbarOpen, setApiKeySnackbarOpen] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [series, setSeries] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [attribution, setAttribution] = useState(true);
  let [publishResponses, setPublishResponses] = useState<any>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTabChangeIndex = (index: number) => {
    setTabValue(index);
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
    setSnackbarOpen(false);
    setLoading(true);
    setPublishResponses([]);

    saveApiKeys();

    const responses = [];

    const request: PublishRequest = {
      title: title,
      tags: tags,
      content: value,
      coverImage,
      series,
      devToApiKey: devToApiKey,
      hashnodeApiKey: hashnodeApiKey,
      mediumApiKey: mediumApiKey,
    };

    console.log(JSON.stringify(request));

    if (devToChecked) {
      try {
        const response = await axios.post("/api/publish/devto", request);

        console.log(response.data);
        responses.push({
          type: "success",
          message: "Blog Successfully Published to Dev.To: ",
          url: response.data.url,
        });
      } catch (err: any) {
        console.log(err);

        responses.push({
          type: "error",
          message:
            "Error while publishing to Dev.To: " +
            (!!err.response.data.message
              ? err.response.data.message
              : err.response.data.error),
        });
      }
    }

    if (hashnodeChecked) {
      try {
        const response = await axios.post("/api/publish/hashnode", request);

        console.log(response.data);
        responses.push({
          type: "success",
          message: "Blog Successfully Published to Hashnode: ",
          url: response.data.url,
        });
      } catch (err: any) {
        console.log(err);

        responses.push({
          type: "error",
          message:
            "Error while publishing to Hashnode: " +
            (!!err.response.data.message
              ? err.response.data.message
              : err.response.data.error),
        });
      }
    }

    if (mediumChecked) {
      try {
        const response = await axios.post("/api/publish/medium", request);

        console.log(response.data);
        responses.push({
          type: "success",
          message: "Blog Successfully Published to Medium: ",
          url: response.data.url,
        });
      } catch (err: any) {
        console.log(err);

        responses.push({
          type: "error",
          message:
            "Error while publishing to Medium: " +
            (!!err.response.data.message
              ? err.response.data.message
              : err.response.data.error),
        });
      }
    }

    setPublishResponses(responses);
    setSnackbarOpen(true);
    setLoading(false);
  };

  const handleEditorChange = (value: any) => {
    setValue(value.text);
  };

  const saveApiKeys = () => {
    // Save keys to local storage
    localStorage.setItem("devToApiKey", devToApiKey);
    localStorage.setItem("hashnodeApiKey", hashnodeApiKey);
    localStorage.setItem("mediumApiKey", mediumApiKey);

    setApiKeySnackbarOpen(true);
  };

  const clearApiKeys = () => {
    // Save keys to local storage
    localStorage.clear();
    setApiKeySnackbarOpen(true);
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

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
          className={styles.tabs}
        >
          <Tab
            icon={<CreateIcon />}
            iconPosition="start"
            label="Write"
            id="full-width-tab-0"
          />
          <Tab
            icon={<TuneIcon />}
            iconPosition="start"
            label="Options"
            id="full-width-tab-1"
          />
          <Tab
            icon={<PublishIcon />}
            iconPosition="start"
            label="Publish"
            id="full-width-tab-2"
          />
        </Tabs>

        <SwipeableViews
          axis="x-reverse"
          index={tabValue}
          onChangeIndex={handleTabChangeIndex}
          className={styles.swipeableViews}
        >
          <div
            role="tabpanel"
            hidden={tabValue !== 0}
            id={`full-width-tabpanel-0`}
            aria-labelledby={`full-width-tab-0`}
          >
            <Box
              sx={{
                width: "100%",
              }}
              mt={2}
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
              style={{ width: "100%", height: "500px" }}
              renderHTML={(text) => <ReactMarkdown children={text} />}
              onChange={handleEditorChange}
            />
          </div>
          <div
            role="tabpanel"
            hidden={tabValue !== 1}
            id={`full-width-tabpanel-1`}
            aria-labelledby={`full-width-tab-1`}
          >
            <Typography variant="h6" gutterBottom component="div">
              Cover Image
            </Typography>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mt={2}
              mb={3}
            >
              <Alert variant="outlined" severity="info">
                Cover Image will not be added for Medium. You&apos;ll have to
                add it manually.
              </Alert>
            </Box>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mb={2}
            >
              <TextField
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
                fullWidth
                label="Cover Image URL"
                id="coverImage"
                type={"url"}
              />
            </Box>

            <Typography variant="h6" gutterBottom component="div">
              Subtitle
            </Typography>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mt={2}
              mb={3}
            >
              <Alert variant="outlined" severity="info">
                Subtitle will only be used in Hashnode
              </Alert>
            </Box>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mb={2}
            >
              <TextField
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                fullWidth
                label="Subtitle"
                id="subtitle"
              />
            </Box>

            <Typography variant="h6" gutterBottom component="div">
              Tags
            </Typography>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mt={2}
              mb={1}
            >
              <Alert variant="outlined" severity="info">
                Tags will not be added for Hashnode. You&apos;ll have to add
                them manually.
              </Alert>
            </Box>
            <Box
              sx={{
                width: "100%",
              }}
              mb={3}
            >
              <Alert variant="outlined" severity="info">
                Tags are mandatory for Dev.To
              </Alert>
            </Box>

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
              Series
            </Typography>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mt={2}
              mb={3}
            >
              <Alert variant="outlined" severity="info">
                Series will only be used in Dev.To
              </Alert>
            </Box>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mb={2}
            >
              <TextField
                value={series}
                onChange={(event) => setSeries(event.target.value)}
                fullWidth
                label="Series"
                id="series"
              />
            </Box>

            <Typography variant="h6" gutterBottom component="div">
              Attribution
            </Typography>
            <FormGroup row={true}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={attribution}
                    onChange={(event) => setAttribution(event.target.checked)}
                  />
                }
                label="Add Attribution to Blogsss at the end"
              />
            </FormGroup>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mt={2}
              mb={3}
            >
              <Alert variant="outlined" severity="info">
                Adds a link to Blogsss at the end of the blog.
              </Alert>
            </Box>
          </div>
          <div
            role="tabpanel"
            hidden={tabValue !== 2}
            id={`full-width-tabpanel-2`}
            aria-labelledby={`full-width-tab-2`}
          >
            <Typography variant="h6" gutterBottom component="div">
              Publish To
            </Typography>
            <FormGroup row={true}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={devToChecked}
                    onChange={handleDevToChange}
                  />
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
                  <Checkbox
                    checked={mediumChecked}
                    onChange={handleMediumChange}
                  />
                }
                label="Medium"
              />
            </FormGroup>

            <Typography variant="h6" gutterBottom component="div">
              API Keys
            </Typography>

            <Box
              sx={{
                width: "100%",
                margin: "1 rem",
              }}
              mt={2}
              mb={3}
            >
              <Alert variant="outlined" severity="info">
                API Keys are saved on the client. If you don&apos;t have one,
                you can get from the respective platform
              </Alert>
            </Box>

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

            <Grid container spacing={1}>
              <Grid item>
                <Button
                  onClick={clearApiKeys}
                  variant="outlined"
                  color="error"
                  size="large"
                >
                  Clear API Keys
                </Button>
              </Grid>
              <Grid item>
                <LoadingButton
                  startIcon={<PublishIcon />}
                  onClick={publishBlog}
                  variant="contained"
                  color="success"
                  size="large"
                  loading={loading}
                  disabled={
                    !title ||
                    title.trim().length === 0 ||
                    !value ||
                    value.trim().length === 0 ||
                    (!devToChecked && !hashnodeChecked && !mediumChecked) ||
                    (devToChecked && !devToApiKey) ||
                    (hashnodeChecked && !hashnodeApiKey) ||
                    (mediumChecked && !mediumApiKey)
                  }
                >
                  Publish
                </LoadingButton>
              </Grid>
            </Grid>

            {snackbarOpen
              ? publishResponses.map((response: any, index: any) => (
                  <Box
                    key={index}
                    sx={{
                      width: "100%",
                      margin: "1 rem",
                    }}
                    mt={2}
                  >
                    <Alert variant="filled" severity={response.type}>
                      {response.message}{" "}
                      <a target="_blank" rel="noreferrer" href={response.url}>
                        {response.url}
                      </a>
                    </Alert>
                  </Box>
                ))
              : null}

            <Snackbar open={apiKeySnackbarOpen} autoHideDuration={2000}>
              <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
                API Keys are saved in the browser
              </Alert>
            </Snackbar>
          </div>
        </SwipeableViews>
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
