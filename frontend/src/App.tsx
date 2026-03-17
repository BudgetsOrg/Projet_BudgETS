import { useState } from "react";
import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // pour avoir accès au npm install react-router-dom
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./style/style.css";
import Inscription from "./Inscription";
import PagePrincipale from "./PagePrincipale";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PagePrincipale />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
