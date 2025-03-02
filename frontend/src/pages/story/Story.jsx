import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import styles from "./Story.module.css";
import Header from "../../components/header/Header";
import { backendAPI } from "../../api/AxiosConfig";
import StoryFooter from "./components/StoryFooter";
import { useSettings } from "../../contexts/SettingsContext";

const Story = () => {
  const { id, progress } = useParams();
  const [storyData, setStoryData] = useState({ title: "", content: "" });
  const { title, content, author, owner } = storyData;
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();
  const contentRef = useRef();
  const [scrollPercent, setScrollPercent] = useState(0);

  // Fetch story data
  const fetchStoryData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await backendAPI.get(`/story/${id}`);
      setStoryData(data);
    } catch (error) {
      console.error("Error getting story data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStoryData();
  }, []);

  // Handle scrolling updates
  const updateScrollPercent = () => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const { scrollTop, scrollHeight, clientHeight } = contentElement;
    const maxScrollTop = scrollHeight - clientHeight;

    if (maxScrollTop <= 300) {
      setScrollPercent(100);
    } else {
      setScrollPercent((scrollTop / maxScrollTop) * 100);
    }
  };

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    if (!loading) {
      updateScrollPercent();
    }

    contentElement.addEventListener("scroll", updateScrollPercent);
    return () =>
      contentElement.removeEventListener("scroll", updateScrollPercent);
  }, [loading]);

  // Scroll to progress point if applicable
  useEffect(() => {
    if (!contentRef.current || loading || !content) return;

    const { scrollHeight, clientHeight } = contentRef.current;
    const maxScrollTop = scrollHeight + 100 - clientHeight;
    if (maxScrollTop > 0) {
      contentRef.current.scrollTo({
        top: (maxScrollTop * parseFloat(progress)) / 100,
        behavior: "smooth",
      });
    }
  }, [progress, loading, content]);

  return (
    <div className={styles.storyPage} ref={contentRef}>
      <Header
        title={title.slice(0, 28) || "Loading..."}
        showBackButton
        showHeading
        fontSize="16px"
      />
      {!loading && (
        <div style={{ fontSize: settings.fontSize }}>
          <div className={styles.initial}>{content.charAt(0)}</div>
          <div className={styles.author}>
            <span>Author:</span> <strong>{author}</strong>
            <br />
            <span>Uploaded by:</span> {owner}
          </div>
          <div className={styles.content}>{content}</div>
          <div className={styles.theEnd}>The End</div>
        </div>
      )}
      <StoryFooter
        percent={loading ? 0 : scrollPercent}
        id={id}
        title={title}
      />
    </div>
  );
};

export default Story;
