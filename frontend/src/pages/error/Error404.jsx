import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";

const Error404 = () => {
  const nav = useNavigate();

  return (
    <div className="page">
      <Header title={"Error 404"} showHeading />
      <p>The page you were looking for could not be found.</p>
      <button onClick={() => nav(-1)}>Go back</button>
    </div>
  );
};

export default Error404;
