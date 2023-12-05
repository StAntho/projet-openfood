import { Navigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

export default function AdminRoute({ children }) {
  const { state } = useUser();
  const { userInfo } = state;
  return userInfo && userInfo.is_admin === 1 ? (
    children
  ) : (
    <Navigate to="/inscription" />
  );
}
