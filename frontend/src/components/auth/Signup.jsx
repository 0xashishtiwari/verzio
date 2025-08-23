import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css"; // same file used for login

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/signup", {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);

      toast.success("Signup successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/auth" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
