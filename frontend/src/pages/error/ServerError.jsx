import React from "react";

import Header from "../../components/header/Header";

const ServerError = () => {
  return (
    <div className="page">
      <Header title={"Network Error"} showHeading />
      <p>
        We are currently experiencing technical difficulties connecting to our
        server. We apologize for the inconvenience and appreciate your patience;
        please try again later.
      </p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
};

export default ServerError;
