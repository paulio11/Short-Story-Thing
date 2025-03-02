import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import { backendAPI } from "../../api/AxiosConfig";

const AddStory = () => {
  const [storyData, setStoryData] = useState({
    title: "",
    author: "",
    content: "",
    is_public: true,
  });
  const { title, author, content, is_public } = storyData;
  const [posting, setPosting] = useState(false);
  const [errors, setErrors] = useState([]);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const { data, status } = await backendAPI.post(
        "/story/create/",
        storyData
      );
      if (status === 201) {
        nav(`/s/${data.id}/0`);
      }
    } catch (error) {
      console.error("Error posting story:", error);
      setErrors(error.response?.data);
    } finally {
      setPosting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setStoryData((prevData) => ({
      ...prevData,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setStoryData({
        ...storyData,
        content: clipboardText,
      });
    } catch (error) {
      console.error("Error pasting from clipboard:", error);
    }
  };

  return (
    <div className="page">
      <Header title="Add Story" showHeading />
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-input-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              required
            />
            {errors.title?.map((error, i) => (
              <div className="message alert" key={i}>
                {error}
              </div>
            ))}
          </div>
          <div className="form-input-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={author}
              onChange={handleChange}
              required
            />
            {errors.author?.map((error, i) => (
              <div className="message alert" key={i}>
                {error}
              </div>
            ))}
          </div>
          <div className="form-input-group">
            <label htmlFor="content">Story content</label>
            <textarea
              name="content"
              id="content"
              value={content}
              onChange={handleChange}
              required
              rows={10}
            ></textarea>
            {errors.content?.map((error, i) => (
              <div className="message alert" key={i}>
                {error}
              </div>
            ))}
          </div>
          <div className="radio-input-group">
            <label>
              <input
                type="radio"
                name="is_public"
                value={true}
                checked={is_public === true}
                onChange={handleChange}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                name="is_public"
                value={false}
                checked={is_public === false}
                onChange={handleChange}
              />
              Private
            </label>
          </div>
          {errors.is_public?.map((error, i) => (
            <div className="message alert" key={i}>
              {error}
            </div>
          ))}
        </div>
        <div className="button-row-between">
          <button
            type="button"
            onClick={handlePaste}
            className="button-with-icon"
          >
            <span className="material-symbols-outlined">content_paste</span>
            Paste from clipboard
          </button>
          <button
            type="submit"
            disabled={!title || !author || !content || posting}
            className="button-with-icon"
          >
            <span className="material-symbols-outlined">add</span>
            {posting ? "Adding" : "Add story"}
          </button>
        </div>
      </form>
      {errors.non_field_errors?.map((message, i) => (
        <div className="message alert" key={i}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default AddStory;
