import React from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/AxiosConfig";

const SettingsOther = () => {
  const { setUser, handleLogout } = useAuth();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await backendAPI.delete("/accounts/delete/");
        setUser(null);
        alert("Account successfully deleted.");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <div className="button-row-between">
      <button onClick={handleDelete} className="button-with-icon">
        <span className="material-symbols-outlined">delete</span>Delete account
      </button>
      <button onClick={handleLogout} className="button-with-icon">
        <span className="material-symbols-outlined">logout</span>Logout
      </button>
    </div>
  );
};

export default SettingsOther;
