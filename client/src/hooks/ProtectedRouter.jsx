import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  isAuthenticated,
  redirectPath = "/login",
}) => {
  if (isAuthenticated === false) {
    return <Navigate to={redirectPath} replace />;
  } else if (isAuthenticated === true) {
    return children;
  }
};

export default ProtectedRoute;
