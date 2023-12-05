import "./style/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Inscription from "./pages/Inscription";
import Seance from "./pages/Seance";
import { userInfo } from "./utils";
import Profile from "./pages/Profile";

export default function App() {
  const [test, setTest] = useState(userInfo);
  return (
    <BrowserRouter>
      <Header test={test} setTest={setTest} />
      <main className="main">
        <Routes>
          <Route path="" element={<Home />} />
          <Route
            path="/inscription"
            element={<Inscription setTest={setTest} />}
          />
          <Route path="/account" element={<Profile setTest={setTest} /> } />
          <Route path="/seance/:id" element={<Seance />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
