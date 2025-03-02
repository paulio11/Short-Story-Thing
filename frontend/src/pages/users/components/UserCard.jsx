import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./UserCard.module.css";
import { formatDate } from "../../../utils/formatDate";

const UserCard = (props) => {
  const { username, created, days_active, current_streak, stories_read } =
    props;
  const nav = useNavigate();

  return (
    <div className={styles.userCard} onClick={() => nav(`/u/${username}`)}>
      <div className={styles.cardTop}>
        <div className={styles.username}>{username}</div>
        <div className={styles.date}>Member since: {formatDate(created)}</div>
      </div>
      <div className={styles.cardBottom}>
        <div>
          Stories read: <strong>{stories_read}</strong>
        </div>
        <div>
          Days active: <strong>{days_active}</strong>
        </div>
        <div>
          Current streak: <strong>{current_streak}</strong>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
