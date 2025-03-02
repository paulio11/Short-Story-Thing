import React, { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/header/Header";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = loginData;
  const [errors, setErrors] = useState([]);
  const { user, handleLogin } = useAuth();

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleLogin(loginData);
    if (error) {
      setErrors(error);
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="page">
      <Header title={"Login"} showHeading />
      {user ? (
        <div className="message">You are already logged in.</div>
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                {errors.password?.map((message, i) => (
                  <div className="message alert" key={i}>
                    {message}
                  </div>
                ))}
              </div>
            </div>
            <div className="button-row-between">
              <button
                type="submit"
                disabled={!username || !password}
                className="button-with-icon"
              >
                <span className="material-symbols-outlined">login</span>
                Login
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

export default Login;
