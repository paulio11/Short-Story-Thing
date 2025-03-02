import React, { useState } from "react";

import styles from "./Activity.module.css";
import { formatDate } from "../../../utils/formatDate";
import { useAuth } from "../../../contexts/AuthContext";
import SmallRating from "../../../components/rating/SmallRating";
import Modal from "../../../components/modal/Modal";

const Activity = (props) => {
  const { author, date, note, owner, progress, is_public, rating, title } =
    props;

  const { user } = useAuth();
  const isOwner = user?.username === owner;
  const progressNum = parseFloat(progress).toFixed(0);
  const hasExtra = rating || note;
  const [showModal, setShowModal] = useState(false);

  // Separate variable so it can be passed into the modal component
  const activityBody = (
    <section className={styles.activity}>
      <div className={styles.breakdown}>
        {owner}{" "}
        {[
          !rating && progressNum < 100 && "read",
          !rating && progressNum == 100 && "finished",
          rating && "rated",
          note && "wrote about",
        ]
          .filter(Boolean)
          .join(", ")
          .replace(/,([^,]*)$/, " and$1")}
        :
      </div>

      <div className={styles.title}>
        <span>{title}</span> <em>by {author}</em>.
      </div>
      {!hasExtra ? (
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBar}
            style={{
              width: `${progressNum}%`,
              backgroundColor: progressNum < 100 ? "#980000" : "#4caf50",
            }}
          >
            {progressNum >= 10 && <>{progressNum}%</>}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.extraContainer}>
            {rating >= 1 && <SmallRating rating={rating} color="goldenrod" />}
          </div>
          {note && (
            <>
              <div className={styles.note}>
                <div className={styles.noteHeader}>
                  <span className="material-symbols-outlined">edit_note</span>
                  {owner}'s notes:
                </div>
                {note}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );

  return (
    <>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        isOwner={isOwner}
        type="activity"
        {...props}
      >
        {activityBody}
      </Modal>
      <div
        className={styles.activityContainer}
        onClick={() => setShowModal(true)}
      >
        <div className={styles.header}>
          <span>{formatDate(date)}</span>
          {isOwner && (
            <span className={`${styles.visibility} material-symbols-outlined`}>
              {is_public ? "visibility" : "lock"}
            </span>
          )}
        </div>
        {activityBody}
      </div>
    </>
  );
};

export default Activity;
