import "./style/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Inscription from "./pages/Inscription";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import Seance from "./pages/Seance";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <ToastContainer position="bottom-center" limit={1} />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/account" element={<Profile />} />
          {/* <Route path="/seance/:id" element={<Seance />} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}
