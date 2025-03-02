import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { backendAPI } from "../../api/AxiosConfig";

const ButtonsStory = (props) => {
  const {
    id,
    isOwner,
    setShowModal,
    is_public,
    user_progress,
    setData,
    title,
  } = props;
  const [errors, setErrors] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const nav = useNavigate();

  const handleDelete = async () => {
    setWaiting(true);
    if (
      window.confirm(
        "Are you sure you want to delete this story? This will also delete any related activity records for you and other users."
      )
    ) {
      try {
        const { status } = await backendAPI.delete(`/story/${id}`);
        if (status === 204) {
          setData((prevData) => prevData.filter((story) => story.id !== id));
        }
        setShowModal(false);
      } catch (error) {
        setErrors(error.response?.data.detail);
        console.error("Error deleting story:", error);
      } finally {
        setWaiting(false);
      }
    }
  };

  const handleIsPublicToggle = async () => {
    setWaiting(true);
    try {
      const { data, status } = await backendAPI.patch(`/story/${id}`, {
        is_public: !is_public,
      });
      if (status === 200) {
        setData((prevData) =>
          prevData.map((activity) => (activity.id === id ? data : activity))
        );
      }
    } catch (error) {
      setErrors(error.response?.data.detail);
      console.error("Error updating story:", error);
    } finally {
      setWaiting(false);
    }
  };

  const handleRead = () => {
    setShowModal(false);
    console.log(user_progress);
    nav(`/s/${id}/${user_progress === 100 ? "0" : user_progress}`);
  };

  const handleRate = () => {
    nav(`/s/close/${id}/${title}`);
  };

  const buttons = [
    ...(isOwner
      ? [
          { label: "Delete", icon: "delete", onClick: handleDelete },
          {
            label: is_public ? "Make private" : "Make public",
            icon: is_public ? "lock" : "visibility",
            onClick: handleIsPublicToggle,
          },
        ]
      : []),
    {
      label:
        user_progress > 0 && user_progress < 100
          ? "Continue reading"
          : user_progress === 100
          ? "Read again"
          : "Read story",
      icon: "book",
      onClick: handleRead,
    },
    {
      label: "Rate story",
      icon: "star",
      onClick: handleRate,
    },
  ];

  return (
    <>
      {buttons.map((button, index) => (
        <button
          key={index}
          className="button-with-icon"
          disabled={waiting}
          onClick={button.onClick}
        >
          <span className="material-symbols-outlined ">{button.icon}</span>
          {button.label}
        </button>
      ))}
      {errors && <div className="message alert">{errors}</div>}
    </>
  );
};

export default ButtonsStory;
