import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./Profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
  const [overview, setOverview] = useState(true);
   const [userDetails, setUserDetails] = useState({
  followedUsers: []
});

    useEffect(()=>{
        const fetchUser = async () => {
            const userId = localStorage.getItem('userId');
         if(userId){
            try {
                const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
                setUserDetails(response.data);
                console.log(response);
            } catch (error) {
                toast.error(error.response.data.message);
                console.error('Error while fetching user details' , error);

            }
        }
        }

        fetchUser();
        
    }, [])

  return (
    <>
      <Navbar />
      <div id="profile">
        {/* Sidebar Profile Section */}
        <div className="profile-sidebar">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
          />
          <h3>{userDetails.username}</h3>
          <button>Follow</button>
          <div className="profile-stats">
            {/* <p>
              <strong>10</strong> Followers
            </p> */}
            <p>
              <strong>{userDetails.followedUsers.length}</strong> Following
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          <button onClick={() => setOverview(true)}>Overview</button>
          <button onClick={() => setOverview(false)}>
            Starred Repositories
          </button>

          {overview ? (
            <div>
              <h2>Overview</h2>
             <HeatMapProfile/>
            </div>
          ) : (
            <div>
              <h2>Starred Repositories</h2>
              <p>List of starred repositories will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
