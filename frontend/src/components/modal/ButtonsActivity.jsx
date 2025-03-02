import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { backendAPI } from "../../api/AxiosConfig";
import { useAuth } from "../../contexts/AuthContext";

const ButtonsActivity = (props) => {
  const { id, story, isOwner, setShowModal, setData, is_public, progress } =
    props;
  const [errors, setErrors] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const { fetchUser } = useAuth();
  const nav = useNavigate();

  const handleDelete = async () => {
    setWaiting(true);
    if (
      window.confirm(
        "Are you sure you want to delete this activity record? This will affect your profile statistics."
      )
    ) {
      try {
        const { status } = await backendAPI.delete(`/activity/${id}`);
        if (status === 204) {
          setData((prevData) =>
            prevData.filter((activity) => activity.id !== id)
          );
          // Update user state for home page continue button
          fetchUser();
          setShowModal(false);
        }
      } catch (error) {
        setErrors(error.response?.data.detail);
        console.error("Error deleting activity record:", error);
      } finally {
        setWaiting(false);
      }
    }
  };

  const handleIsPublicToggle = async () => {
    setWaiting(true);
    try {
      const { data, status } = await backendAPI.patch(`/activity/${id}`, {
        is_public: !is_public,
      });
      if (status === 200) {
        setData((prevData) =>
          prevData.map((activity) => (activity.id === id ? data : activity))
        );
      }
    } catch (error) {
      setErrors(error.response?.data.detail);
      console.error("Error updating activity record:", error);
    } finally {
      setWaiting(false);
    }
  };

  const handleRead = () => {
    setShowModal(false);
    nav(`/s/${story}/${isOwner && progress !== "100.00" ? progress : "0"}`);
  };

  const buttons = [
    ...(isOwner
      ? [
          {
            label: "Delete",
            icon: "delete",
            onClick: handleDelete,
          },
          {
            label: is_public ? "Make private" : "Make public",
            icon: is_public ? "lock" : "visibility",
            onClick: handleIsPublicToggle,
          },
        ]
      : []),
    {
      label: isOwner
        ? progress > 0 && progress < 100
          ? "Continue reading"
          : "Read again"
        : "Read story",
      icon: "book",
      onClick: handleRead,
    },
  ];

  return (
    <>
      {buttons.map((button, index) => (
        <button
          disabled={waiting}
          key={index}
          className="button-with-icon"
          onClick={button.onClick}
        >
          <span className="material-symbols-outlined">{button.icon}</span>
          {button.label}
        </button>
      ))}
      {errors && <div className="message alert">{errors}</div>}
    </>
  );
};

export default ButtonsActivity;
