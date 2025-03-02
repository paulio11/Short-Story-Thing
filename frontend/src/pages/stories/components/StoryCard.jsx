import React, { useEffect, useState } from "react";

import styles from "./StoryCard.module.css";
import { backendAPI } from "../../../api/AxiosConfig";
import { useAuth } from "../../../contexts/AuthContext";
import SmallRating from "../../../components/rating/SmallRating";
import Modal from "../../../components/modal/Modal";
import Bookmark from "../../../components/bookmark/Bookmark";

const StoryCard = (props) => {
  const {
    id,
    author,
    is_public,
    owner,
    title,
    user_progress,
    user_rating,
    word_count,
  } = props;

  const { user } = useAuth();
  const isOwner = owner === user?.username;
  const progressNum = parseFloat(user_progress).toFixed(0);
  const hasRead = user_progress === 100;
  const [showModal, setShowModal] = useState(false);
  // const [activityData, setActivityData] = useState([]);

  const storyCard = (
    <div className={styles.storyCard}>
      <div className={styles.cardTop}>
        <div className={styles.title}>{title}</div>
        <div className={styles.author}>{author}</div>
      </div>
      <div
        className={styles.cardBottom}
        style={{ backgroundColor: hasRead ? "#4caf50" : "#980000" }}
      >
        <div className={styles.userStats}>
          {user_progress > 0 && <div>{progressNum}%</div>}
          {user_rating && (
            <SmallRating rating={user_rating} color="gold" size="14px" />
          )}
          {isOwner && (
            <span className={`material-symbols-outlined ${styles.isPublic}`}>
              {is_public ? "visibility" : "lock"}
            </span>
          )}
        </div>
        <div className={styles.wordCount}>{word_count} words</div>
      </div>
    </div>
  );

  // const getActivityData = async () => {
  //   try {
  //     const { data } = await backendAPI.get(`/activity/list/?story=${id}`);
  //     setActivityData(data);
  //   } catch (error) {
  //     console.error("Error fetching activity data:", error);
  //   }
  // };

  const handleClick = () => {
    // getActivityData();
    setShowModal(true);
  };

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        isOwner={isOwner}
        type="story"
        {...props}
      >
        {storyCard}
      </Modal>
      {user_progress > 0 && showModal && (
        <Bookmark progress={user_progress} id={id} />
      )}
      <div onClick={handleClick}>{storyCard}</div>
    </>
  );
};

export default StoryCard;
