import React from "react";

import Header from "../../components/header/Header";

const Changelog = () => {
  return (
    <div className="page">
      <Header title={"Changelog"} showHeading />
      <h3>v0.2 - Sunday, Mar 2nd 2025</h3>
      <section>
        <h4>General</h4>
        <ul>
          <li>
            The header is now a separate component that sets the page title and
            can dynamically display a heading and/or a back button.
          </li>
          <li>
            Refactored nearly all code, improving efficiency, readability, and
            maintainability.
          </li>
        </ul>

        <h4>Menu</h4>
        <ul>
          <li>
            Added a link to the <strong>Users</strong> page.
          </li>
          <li>
            Added a link to the <strong>Changelog</strong>.
          </li>
          <li>
            Removed the <strong>Logout</strong> link.
          </li>
        </ul>

        <h4>Home</h4>
        <ul>
          <li>
            Users can now resume reading their last unfinished story directly
            from the home screen.
          </li>
        </ul>

        <h4>Stories</h4>
        <ul>
          <li>
            Uploaders can now view the public/private status of their stories.
          </li>
          <li>
            Replaced the front cover view with a pop-up modal that allows users
            to:
            <ul>
              <li>Delete a story (if they are the uploader).</li>
              <li>
                Toggle the story’s public/private status (if they are the
                uploader).
              </li>
              <li>Read or continue the story.</li>
              <li>Add a note and/or rating.</li>
            </ul>
          </li>
        </ul>

        <h4>Story</h4>
        <ul>
          <li>
            <strong>Fix:</strong> Users can now close a story even if it does
            not take up the entire page.
          </li>
          <li>
            <strong>Fix:</strong> Users can rate a story or leave a note without
            creating duplicate 100% progress activity records.
          </li>
          <li>
            <strong>Fix:</strong> Rapid multiple clicks of the bookmark button
            no longer generate duplicate activity records.
          </li>
          <li>Implemented a new layout.</li>
          <li>
            Closing a book now instantly creates a 100% progress activity
            record.
          </li>
        </ul>

        <h4>Profile</h4>
        <ul>
          <li>
            <strong>New Statistics:</strong>
            <ul>
              <li>
                <strong>Days Active:</strong> Counts the number of unique days
                with at least one activity record.
              </li>
              <li>
                <strong>Current Streak:</strong> Tracks the number of
                consecutive days with activity records, resetting to{" "}
                <strong>0</strong> if a day is missed.
              </li>
            </ul>
          </li>
          <li>
            Activity record owners can now view the public/private status of
            their records.
          </li>
          <li>
            Activity records are now more granular—separating{" "}
            <strong>story completion activities</strong> from{" "}
            <strong>rating or note activities</strong>, as stories can now be
            rated without being finished.
          </li>
          <li>
            Clicking an activity record allows:
            <ul>
              <li>
                The owner to{" "}
                <strong>delete or toggle the public/private status</strong>.
              </li>
              <li>
                The owner to{" "}
                <strong>
                  resume the story from their last progress point or start over
                </strong>
                .
              </li>
              <li>
                Any user to <strong>read the associated story</strong>.
              </li>
            </ul>
          </li>
          <li>
            <strong>Issue:</strong> The <strong>Read</strong> button still
            appears for private stories when viewed by non-owners.
          </li>
        </ul>

        <h4>Users</h4>
        <ul>
          <li>
            Introduced a <strong>Users</strong> page listing all app users, with
            links to their profiles.
          </li>
          <li>
            Users can now search for other users by <strong>username</strong>.
          </li>
        </ul>

        <h4>Settings</h4>
        <ul>
          <li>
            Removed the <strong>story deletion form</strong>.
          </li>
          <li>
            Users can now <strong>set a custom bookmark color</strong>.
          </li>
          <li>
            Moved the <strong>Logout</strong> button to the{" "}
            <strong>Settings</strong> page.
          </li>
        </ul>
        <h4>Upcoming Features/Fixes</h4>
        <ul>
          <li>
            Implementing a <strong>maximum story size</strong> setting for the
            home page’s <strong>random story button</strong>.
          </li>
          <li>
            Addressed issue where focusing on a form input element caused
            unintended scroll and zoom behavior.
          </li>
          <li>
            Improve design resilience against lengthy data fields disrupting the
            layout.
          </li>
        </ul>
      </section>
      <h3>v0.1 - Sunday, Feb 26th 2025</h3>
      <section>
        <ul>
          <li>Initial release</li>
        </ul>
      </section>
    </div>
  );
};

export default Changelog;
