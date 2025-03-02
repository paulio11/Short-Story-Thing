import React from "react";

import Header from "../../components/header/Header";
import FontSizeForm from "./components/FontSizeForm";
// import DeleteStoryForm from "./components/DeleteStoryForm";
import UsernameChangeForm from "./components/UsernameChangeForm";
import PasswordChangeForm from "./components/PasswordChangeForm";
import SettingsOther from "./components/SettingsOther";
import ChangeBookmarkForm from "./components/ChangeBookmarkForm";

const Settings = () => {
  return (
    <div className="page">
      <Header title={"Settings"} showHeading />
      <FontSizeForm />
      <ChangeBookmarkForm />
      {/* <DeleteStoryForm /> No unsed, functionality is in the popup story modal */}
      <UsernameChangeForm />
      <PasswordChangeForm />
      <SettingsOther />
    </div>
  );
};

export default Settings;
