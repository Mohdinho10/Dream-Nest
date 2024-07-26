import { useUser } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
