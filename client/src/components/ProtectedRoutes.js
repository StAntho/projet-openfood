import { Navigate } from "react-router-dom";
import { useCart } from "../components/CartContext";

export default function ProtectedRoute({ children }) {
  const { state } = useCart();
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/inscription" />;
}
