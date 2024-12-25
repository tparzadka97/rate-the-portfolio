import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import CreatePortfolio from "./pages/create-portfolio/CreatePortfolio";

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePortfolio />} />
      </Routes>
    </div>
  );
}

export default App;
