import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/user/${userId}`);
        setRepositories(response.data.repositories);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching repositories");
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/all`);
        setSuggestedRepositories(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching suggested repositories");
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
    <Navbar/>
    <section id="dashboard">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h3>Suggested Repositories</h3>
        {suggestedRepositories.map((repo) => (
          <div className="repo-card" key={repo._id}>
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
          </div>
        ))}
      </aside>

      {/* Main Section */}
      <main className="main-content">
        <h2>Your Repositories</h2>
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search repositories..."
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        {searchResults.map((repo) => (
          <div className="repo-card" key={repo._id}>
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
          </div>
        ))}
      </main>

      {/* Right Sidebar */}
      <aside className="sidebar">
        <h3>Upcoming Events</h3>
        <ul>
          <li>Tech conference - Dec 15</li>
          <li>Developer meetup - Dec 25</li>
          <li>React summit - Jan 5</li>
        </ul>
      </aside>
    </section>
        </>
  );
};

export default Dashboard;
