import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";
import RandomStoryBtn from "./components/RandomStoryBtn";

const Home = () => {
  const { user } = useAuth();
  const nav = useNavigate();

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

              <RandomStoryBtn />
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
