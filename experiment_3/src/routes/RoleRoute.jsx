import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px", fontWeight: "bold" }}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};
export default RoleRoute;
