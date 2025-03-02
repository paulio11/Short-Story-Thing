import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendAPI } from "../api/AxiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const nav = useNavigate();

  // Helper to set or remove the Authorization header for backendAPI
  const setAuthToken = (token) => {
    if (token) {
      backendAPI.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete backendAPI.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    // When the app loads, if there's a token stored, attach it
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // No need for withCredentials here since we are using tokens
      const { data } = await backendAPI.get("/dj-rest-auth/user/");
      setUser(data);
    } catch (error) {
      if (error.response?.status === 401) {
        // If unauthorized, clear the user session
        handleLogout();
      }
    } finally {
      setUserLoading(false);
    }
  };

  const handleLogin = async (loginData) => {
    try {
      const response = await backendAPI.post("/dj-rest-auth/login/", loginData);
      if (response.status === 200) {
        // Assume the token is returned as response.data.key
        const token = response.data.key;
        localStorage.setItem("authToken", token);
        setAuthToken(token);
        await fetchUser();
        nav("/");
        // Optional: Reload the page to update the UI fully
        // location.reload();
      }
    } catch (error) {
      return error.response?.data;
    }
  };

  const handleLogout = async () => {
    try {
      // Optionally call the backend logout endpoint
      await backendAPI.post("/dj-rest-auth/logout/");
    } catch (error) {
      console.error("Logout failed.", error);
    } finally {
      localStorage.removeItem("authToken");
      setAuthToken(null);
      setUser(null);
      nav("/");
      // location.reload();
    }
  };

  const contextValue = {
    user,
    setUser,
    fetchUser,
    userLoading,
    setUserLoading,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
