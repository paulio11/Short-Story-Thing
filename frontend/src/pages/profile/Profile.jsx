import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import styles from "./Profile.module.css";
import Error404 from "../error/Error404";
import Header from "../../components/header/Header";
import Activity from "./components/Activity";
import { backendAPI } from "../../api/AxiosConfig";
import { formatDate } from "../../utils/formatDate";

const Profile = () => {
  const { username, fromNav } = useParams();
  const [profileData, setProfileData] = useState({
    stories_read: 0,
    stories_rated: 0,
    stories_uploaded: 0,
    average_rating: 0,
    created: "",
    days_active: 0,
    current_streak: 0,
  });
  const {
    stories_read,
    stories_rated,
    stories_uploaded,
    average_rating,
    created,
    days_active,
    current_streak,
  } = profileData;
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [profileResponse, activityResponse] = await Promise.all([
          backendAPI.get(`/accounts/${username}`),
          backendAPI.get(`/activity/list/?owner__username=${username}`),
        ]);
        setProfileData(profileResponse.data);
        setActivityData(activityResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (!loading && errors.response?.status === 404) {
    return <Error404 />;
  }

  return (
    <div className="page">
      <Header
        title={username}
        showHeading
        showBackButton={fromNav !== "true"}
      />
      <h3>Stats</h3>
      <section className={styles.tableContainer}>
        {!loading && (
          <table className={styles.statsTable}>
            <tbody>
              <tr>
                <td>Stories uploaded</td>
                <td>{stories_uploaded}</td>
              </tr>
              <tr>
                <td>Stories read</td>
                <td>{stories_read}</td>
              </tr>
              <tr>
                <td>Stories rated</td>
                <td>{stories_rated}</td>
              </tr>
              <tr>
                <td>Average rating</td>
                <td>{average_rating} ★</td>
              </tr>
              <tr>
                <td>Member since</td>
                <td>{formatDate(created)}</td>
              </tr>
              <tr>
                <td>Days active</td>
                <td>
                  {days_active}{" "}
                  {days_active > 1 || !days_active ? "days" : "day"}
                </td>
              </tr>
              <tr>
                <td>Current streak</td>
                <td>
                  {current_streak}{" "}
                  {current_streak > 1 || !current_streak ? "days" : "day"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      {!loading && (
        <>
          <h3>Activity</h3>
          {activityData?.length ? (
            activityData.map((activity, index) => (
              <Activity key={index} {...activity} setData={setActivityData} />
            ))
          ) : (
            <div className="message">
              {username} has no recorded activity yet 😭
            </div>
          )}
          {}
        </>
      )}
    </div>
  );
};

export default Profile;
