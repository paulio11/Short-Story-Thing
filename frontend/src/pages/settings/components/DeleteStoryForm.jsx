import React, { useEffect, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/AxiosConfig";

const DeleteStoryForm = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storyID, setStoryID] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
      try {
        const { data } = await backendAPI.get(`/story/list/?owner=${user.pk}`);
        setStories(data);
      } catch (error) {
        console.error("Failed to get user stories:", error);
      } finally {
        setLoading(false);
      }
    };
    getStories();
  }, [user]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this story. This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const { status } = await backendAPI.delete(`/story/${storyID}`);
      if (status === 204) {
        setStories((prevStories) =>
          prevStories.filter((story) => story.id !== storyID)
        );
        setStoryID("");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <div className="form-inputs">
        <div className="form-input-group">
          <label htmlFor="deletestory">Delete a story</label>
          <select
            name="deletestory"
            id="deletestory"
            value={storyID}
            onChange={(e) => setStoryID(Number(e.target.value))}
            disabled={loading || !stories.length}
          >
            {loading ? (
              <option value="" disabled>
                Loading your stories...
              </option>
            ) : (
              <>
                <option value="" disabled>
                  Select a story to delete
                </option>
                {stories.map((story, index) => (
                  <option key={index} value={story.id}>
                    {story.title}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        <div className="form-input-group">
          <strong>Warning:</strong> Deleting a story will also remove any
          associated activity from all users.
        </div>
        <button type="submit" disabled={!storyID}>
          Delete story
        </button>
      </div>
    </form>
  );
};

export default DeleteStoryForm;
