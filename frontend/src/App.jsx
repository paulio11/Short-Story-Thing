import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { setBackendAvailabilityCallback } from "./api/AxiosConfig";
import { useAuth } from "./contexts/AuthContext";

import ServerError from "./pages/error/ServerError";
import Error404 from "./pages/error/Error404";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";
import Changelog from "./pages/dev/Changelog";
import AddStory from "./pages/addStory/AddStory";
import Stories from "./pages/stories/Stories";
import Story from "./pages/story/Story";
import CloseBook from "./pages/closeBook/CloseBook";
import Users from "./pages/users/Users";

function App() {
  const { userLoading } = useAuth();
  const { pathname } = useLocation();
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    setBackendAvailabilityCallback(setBackendAvailable);
  }, []);

  if (userLoading) {
    return null;
  }

  if (!backendAvailable) {
    return <ServerError />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<Users />} />
        <Route path="/u/:username" element={<Profile />} />
        {/* For use in menu (hides back button) */}
        <Route path="/u/:username/:fromNav" element={<Profile />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/s/:id/:progress" element={<Story />} />
        <Route path="/s/close/:id/:title" element={<CloseBook />} />
        <Route path="/s/add" element={<AddStory />} />
        <Route path="/dev/changelog" element={<Changelog />} />
      </Routes>
    </>
  );
}

export default App;
