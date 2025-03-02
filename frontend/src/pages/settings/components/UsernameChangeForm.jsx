import React, { useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { backendAPI } from "../../../api/AxiosConfig";

const UsernameChangeForm = () => {
  const { user, setUser } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await backendAPI.patch("/dj-rest-auth/user/", {
        username: newUsername,
      });
      if (status === 200) {
        setUser({ ...user, username: newUsername });
        setNewUsername("");
      }
    } catch (error) {
      console.error("Error changing username:", error);
      setErrors(error.response?.data);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-input-group">
            <label htmlFor="username">New username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder={user.username}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              required
            />
            {errors.username?.map((message, i) => (
              <div className="message alert" key={i}>
                {message}
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={user?.username === newUsername || !newUsername}
          >
            Change username
          </button>
        </div>
      </form>
      {errors.non_field_errors?.map((message, i) => (
        <div className="message alert" key={i}>
          {message}
        </div>
      ))}
    </>
  );
};

export default UsernameChangeForm;
