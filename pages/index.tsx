import { Button, Typography } from "@mui/material";
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

const Home: NextPage = () => {
  const [value, setValue] = useState("");

  const handleClick = () => {
    console.log(value);
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

        <Typography
          variant="subtitle1"
          className={styles.subtitle}
          gutterBottom
          component="div"
        >
          Get started by writing blog in text editor below
        </Typography>

        <MdEditor
          style={{ width: "100%", height: "500px", margin: "1rem" }}
          renderHTML={(text) => <ReactMarkdown children={text} />}
          onChange={handleEditorChange}
        />

        <Button onClick={handleClick} variant="contained" color="success">
          Publish
        </Button>
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
