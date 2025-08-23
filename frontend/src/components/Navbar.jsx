import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // new CSS file
import { useAuth } from "../authContext";

const Navbar = () => {
  const {setCurrentUser} = useAuth();
  return (
    <nav className="navbar">
     <Link to="/" className="navbar-logo">
  <i className="fa-solid fa-code-compare fa-rotate-270"></i>
  <h3>Verzio</h3>
</Link>


      <div className="navbar-links">
        <Link to="/create">Create a Repository</Link>
        <Link to="/profile">Profile</Link>
        <Link onClick={()=>{
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          setCurrentUser(null);
        }} to={'/auth'} >Logout</Link> 
      </div>
    </nav>
  );
};

export default Navbar;
