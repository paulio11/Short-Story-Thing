import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "./Navbar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import ClearIconBtn from "../ClearIconBtn/ClearIconBtn";

const Navbar = ({ showSidebar, setShowSidebar }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const nav = useNavigate();
  const location = useLocation();
  const menuRef = useRef();

  const noUserLinks = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  const userLinks = [
    { to: "/", label: "Home" },
    { to: "/stories", label: "Stories" },
    { to: "/s/add", label: "Add" },
    { to: `/u/${user?.username}/true`, label: "My Profile" },
    { to: `/users`, label: "Users" },
    { to: "/settings", label: "Settings" },
  ];

  const links = !!user ? userLinks : noUserLinks;
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickLink = (to) => {
    setShowSidebar(false);
    setTimeout(() => {
      nav(to);
    }, 300);
  };

  return (
    <div
      className={`${styles.navBackground} ${
        showSidebar ? styles.showBackground : ""
      }`}
    >
      <nav
        className={`${styles.navMenu} ${showSidebar ? styles.show : ""}`}
        ref={menuRef}
        style={{ backgroundColor: settings.bookmarkColor }}
      >
        <div className={styles.closeBtn}>
          <ClearIconBtn
            icon="close"
            onClickFunction={() => setShowSidebar(false)}
          />
        </div>

        <div className={styles.navTitle}>
          {user && (
            <>
              <div>Hello</div>
              <div>{user.username}</div>
            </>
          )}
        </div>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <Link
                className={`${styles.navLink} ${
                  isActive(link.to) ? styles.activeLink : ""
                }`}
                onClick={() => handleClickLink(link.to)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className={styles.versionInfo} to={"/dev/changelog"}>
          v0.2 | changelog
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
