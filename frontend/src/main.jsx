import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./authContext.jsx";
import ProjectRoutes from "./Routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <ProjectRoutes />
      {/* Global ToastContainer so it always exists */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  </AuthProvider>
);
