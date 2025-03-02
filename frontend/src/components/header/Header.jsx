import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Header.module.css";
import ClearIconBtn from "../ClearIconBtn/ClearIconBtn";
import Navbar from "../navbar/Navbar";

const Header = ({ title, showBackButton, showHeading, fontSize, backTo }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    document.title = title + " - Short Story Thing";
  }, [title]);

  return (
    <>
      <div
        className={styles.header}
        style={{ backgroundColor: isHome && "#fff" }}
      >
        <div className={styles.menuBtnContainer}>
          <ClearIconBtn
            icon="menu"
            onClickFunction={() => setShowSidebar(!showSidebar)}
          />
        </div>
        <div className={styles.leftHeader}>
          <div className={styles.backBtn}>
            {showBackButton && (
              <ClearIconBtn
                icon="chevron_left"
                onClickFunction={() => nav(backTo ? backTo : -1)}
              />
            )}
          </div>
          {showHeading && (
            <h2 className={styles.title} style={{ fontSize: fontSize }}>
              {title}
            </h2>
          )}
        </div>
      </div>
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
    </>
  );
};

export default Header;
