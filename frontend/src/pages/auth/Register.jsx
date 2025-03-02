import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { backendAPI } from "../../api/AxiosConfig";
import Header from "../../components/header/Header";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const { username, password1, password2 } = registerData;
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status } = await backendAPI.post(
        "/dj-rest-auth/registration/",
        registerData
      );
      if (status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      setErrors(error.response?.data);
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="page">
      <Header title={"Register"} showHeading />
      {success ? (
        <div className="message">
          <span>You have successfully registered.</span>
          <button onClick={() => nav("/login")}>Login</button>
        </div>
      ) : user ? (
        <div className="message">You have already registered.</div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-inputs">
              <div className="form-input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={handleChange}
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
              <div className="form-input-group">
                <label htmlFor="password1">Password</label>
                <input
                  type="password"
                  name="password1"
                  id="password1"
                  value={password1}
                  onChange={handleChange}
                  required
                />
                {errors.password1?.map((message, i) => (
                  <div className="message alert" key={i}>
                    {message}
                  </div>
                ))}
              </div>
              <div className="form-input-group">
                <label htmlFor="password2">Confirm password</label>
                <input
                  type="password"
                  name="password2"
                  id="password2"
                  value={password2}
                  onChange={handleChange}
                  required
                />
                {errors.password2?.map((message, i) => (
                  <div className="message alert" key={i}>
                    {message}
                  </div>
                ))}
              </div>
            </div>
            <div className="button-row-between">
              <button
                type="submit"
                disabled={
                  !username ||
                  !password1 ||
                  !password2 ||
                  password1 !== password2
                }
                className="button-with-icon"
              >
                <span className="material-symbols-outlined">person</span>
                Register
              </button>
            </div>
          </form>
          {errors.non_field_errors?.map((message, i) => (
            <div className="message alert" key={i}>
              {message}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Register;
