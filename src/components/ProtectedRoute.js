import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   return <p>Loading...</p>; // Prevents flashing effect while checking auth
  // }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
