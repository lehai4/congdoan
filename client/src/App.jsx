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
      <Layout
        style={{
          height: "100%",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Layout className="w-full h-full max-screen flex-row items-center justify-center">
          <div className="container">
            <Router isAuthenticated={user ? true : false} user={user} />
          </div>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
