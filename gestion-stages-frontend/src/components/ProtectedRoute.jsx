import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";

function ProtectedRoute({ children }) {

  const { auth } = useContext(AuthContext);

  if (!auth) {

    return <Login />;

  }

  return children;
}

export default ProtectedRoute;