import React, { useEffect, useState } from "react";

import Header from "../../components/header/Header";
import { backendAPI } from "../../api/AxiosConfig";
import UserCard from "./components/UserCard";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await backendAPI.get(
        `/accounts/list/?search=${searchQuery}`
      );
      setUsers(data);
    } catch (error) {
      console.error("Error getting user list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    getUsers();
  };

  return (
    <div className="page">
      <Header title="Users" showHeading />
      <form onSubmit={handleSearch}>
        <div className="searchBar">
          <label htmlFor="search" className="hidden-label">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a user"
          />
          <button className="button-with-icon" type="submit">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </form>
      {!loading && users.length === 0 && (
        <div className="message">There are no matching users 😢</div>
      )}
      {!loading && users.length >= 1 && (
        <div>
          {users.map((user, index) => (
            <UserCard key={index} {...user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
