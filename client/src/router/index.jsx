import { default as React } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../hooks/ProtectedRouter";
import Login from "../page/Authorization/Login";
import HomePage from "../page/Home";
import LayoutContent from "../components/Layout";
import UserPage from "../page/Home/UserPage";

const Router = ({ isAuthenticated, user }) => {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      {token ? (
        <>
          <Route path="/" element={<LayoutContent />}>
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {user.role === "admin" ? <HomePage /> : <UserPage />}
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </>
      ) : (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="login" />} />
        </>
      )}
    </Routes>
  );
};

export default Router;
