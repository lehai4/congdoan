import { Layout } from "antd";
import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import Router from "./router";
import { AuthContext } from "./hooks/context";

function App() {
  let { user } = useContext(AuthContext);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="h-full max-h-screen overflow-auto">
        <Router isAuthenticated={user ? true : false} user={user} />
      </div>
    </>
  );
}

export default App;
