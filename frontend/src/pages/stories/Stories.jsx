import React, { useEffect, useState } from "react";

import styles from "./Stories.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/AxiosConfig";
import Header from "../../components/header/Header";
import StoryCard from "./components/StoryCard";

const Stories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const initialFilters = {
    searchQuery: "",
    sortOrder: "desc",
    sortBy: "created",
    owner: "all",
    progress: {
      p0: false,
      p100: false,
      pInbetween: false,
    },
  };

  const [filters, setFilters] = useState(initialFilters);
  const isDisabled = JSON.stringify(filters) === JSON.stringify(initialFilters);

  const getStories = async (filters) => {
    setLoading(true);

    let queryString = "";

    if (filters.searchQuery) {
      queryString += `search=${filters.searchQuery}&`;
    }
    if (filters.owner === "user") {
      queryString += `owner=${user.pk}&`;
    }
    if (filters.sortBy) {
      queryString += `ordering=${
        filters.sortOrder === "asc" ? filters.sortBy : `-${filters.sortBy}`
      }&`;
    }

    const progressFilters = [];
    if (filters.progress.p0) progressFilters.push("0");
    if (filters.progress.pInbetween) progressFilters.push("inbetween");
    if (filters.progress.p100) progressFilters.push("100");

    if (progressFilters.length > 0) {
      queryString +=
        progressFilters
          .map((progress) => `user_progress=${progress}`)
          .join("&") + "&";
    }

    if (queryString.endsWith("&")) {
      queryString = queryString.slice(0, -1);
    }

    try {
      const { data } = await backendAPI.get(`/story/list/?${queryString}`);
      setStories(data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStories(initialFilters);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    getStories(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    getStories(initialFilters);
  };

  return (
    <div className="page">
      <Header title="Stories" showHeading />
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className="searchBar">
          <label htmlFor="search" className="hidden-label">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by title or author"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value.trim() })
            }
          />
          <button type="submit" className="button-with-icon">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="button-with-icon"
        >
          <span className="material-symbols-outlined">
            {showFilters ? "close" : "filter_alt"}
          </span>
          Filters
        </button>
      </form>
      {showFilters && (
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div className="form-input-group">
              <label htmlFor="owner" className="hidden-label">
                Owner
              </label>
              <select
                name="owner"
                id="owner"
                value={filters.owner}
                onChange={(e) =>
                  setFilters({ ...filters, owner: e.target.value })
                }
              >
                <option value="all">All stories</option>
                <option value="user">My stories</option>
              </select>
            </div>
            <div className="form-input-group">
              <label htmlFor="sort-by">Sort by</label>
              <div className={styles.sortBy}>
                <select
                  name="sort-by"
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                >
                  <option value="title">Title</option>
                  <option value="user_rating">Your rating</option>
                  <option value="user_progress">Your progress</option>
                  <option value="created">Date added</option>
                  <option value="word_count">Length</option>
                </select>
                <button
                  type="button"
                  className="button-with-icon"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      sortOrder: filters.sortOrder === "desc" ? "asc" : "desc",
                    })
                  }
                >
                  <span className="material-symbols-outlined">
                    {filters.sortOrder === "desc"
                      ? "arrow_downward"
                      : "arrow_upward"}
                  </span>
                </button>
              </div>
            </div>
            <div className="checkbox-input-group">
              <label>
                <input
                  type="checkbox"
                  name="0"
                  checked={filters.progress.p0}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      progress: {
                        ...filters.progress,
                        p0: e.target.checked,
                      },
                    })
                  }
                />
                Unread
              </label>
              <label>
                <input
                  type="checkbox"
                  name="inbetween"
                  checked={filters.progress.pInbetween}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      progress: {
                        ...filters.progress,
                        pInbetween: e.target.checked,
                      },
                    })
                  }
                />
                Reading
              </label>
              <label>
                <input
                  type="checkbox"
                  name="100"
                  checked={filters.progress.p100}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      progress: {
                        ...filters.progress,
                        p100: e.target.checked,
                      },
                    })
                  }
                />
                Read
              </label>
            </div>
            <div className="button-row-between">
              <button type="button" disabled={isDisabled} onClick={handleReset}>
                Reset
              </button>
              <button type="submit" disabled={isDisabled}>
                Apply
              </button>
            </div>
          </div>
        </form>
      )}
      {!loading && stories.length === 0 && (
        <div className="message">There are no stories ☹️.</div>
      )}
      {!loading ? (
        <div>
          {stories.map((story, i) => (
            <StoryCard key={i} {...story} setData={setStories} />
          ))}
        </div>
      ) : (
        <div className="message">Loading...</div>
      )}
    </div>
  );
};

export default Stories;
