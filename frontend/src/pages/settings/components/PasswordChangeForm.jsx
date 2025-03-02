import React, { useState } from "react";

import { backendAPI } from "../../../api/AxiosConfig";

const PasswordChangeForm = () => {
  const [errors, setErrors] = useState([]);
  const [passwordData, setPasswordData] = useState({
    new_password1: "",
    new_password2: "",
  });
  const { new_password1, new_password2 } = passwordData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await backendAPI.post(
        "/dj-rest-auth/password/change/",
        passwordData
      );
      if (status === 200) {
        setPasswordData({
          new_password1: "",
          new_password2: "",
        });
      }
    } catch (error) {
      setErrors(error.response?.data);
      console.error("Error changing password:", error);
    }
  };

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <div className="form-input-group">
            <label htmlFor="new_password1">New password</label>
            <input
              type="password"
              name="new_password1"
              id="new_password1"
              value={new_password1}
              onChange={handleChange}
              required
            />
            {errors.new_password1?.map((message, i) => (
              <div className="message alert" key={i}>
                {message}
              </div>
            ))}
          </div>
          <div className="form-input-group">
            <label htmlFor="new_password2">Confirm new password</label>
            <input
              type="password"
              name="new_password2"
              id="new_password2"
              value={new_password2}
              onChange={handleChange}
              required
            />
            {errors.new_password2?.map((message, i) => (
              <div className="message alert" key={i}>
                {message}
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={
              !new_password1 ||
              !new_password2 ||
              new_password1 !== new_password2
            }
          >
            Change password
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

export default PasswordChangeForm;
