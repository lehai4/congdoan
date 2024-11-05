import { default as React } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../hooks/ProtectedRouter";
import Login from "../page/Authorization/Login";
import HomePage from "../page/Home";

const Router = ({ isAuthenticated, user }) => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {token ? (
        <>
          {user.role === "admin" && (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
          {user.role === "user" && (
            <>
              <Route
                path="/"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </>
      ) : (
        <>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="login" />} />
        </>
      )}
    </Routes>
  );
};

export default Router;
