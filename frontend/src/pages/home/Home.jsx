import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";
import { backendAPI } from "../../api/AxiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";

const Home = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [length, setLength] = useState(10000);

  const readRandom = async () => {
    try {
      const { data } = await backendAPI.get("/story/random/");
      const randomID = data.id;
      nav(`/s/${randomID}/0`);
    } catch (error) {
      console.error("Error getting random story ID:", error);
    }
  };

  return (
    <div>
      <Header title={"Home"} />
      <div className={styles.home}>
        <div className={styles.websiteTitle}>
          <h1>Short Story</h1>
          <h2>Thing</h2>
        </div>

        <div className="button-col">
          {user ? (
            <>
              {user.last_reading && user.last_reading.progress < 100 && (
                <button
                  className="button-with-icon"
                  onClick={() =>
                    nav(
                      `/s/${user.last_reading.story}/${user.last_reading.progress}`
                    )
                  }
                >
                  <span className="material-symbols-outlined">book</span>{" "}
                  Continue last story
                </button>
              )}
              <button onClick={readRandom} className="button-with-icon">
                <span className="material-symbols-outlined">menu_book</span>{" "}
                Read a random story
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => nav("/login")}
                className="button-with-icon"
              >
                <span className="material-symbols-outlined">login</span>
                Login
              </button>
              <button
                onClick={() => nav("/Register")}
                className="button-with-icon"
              >
                <span className="material-symbols-outlined">person</span>
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
