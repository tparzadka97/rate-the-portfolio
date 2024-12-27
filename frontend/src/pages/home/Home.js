import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Navbar from "../../components/navbar/Navbar";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const navigateTo = (url) => {
    navigate(url);
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="home-container">
        <h1 className="home-text">Rate the Portfolio</h1>
        <div className="button-container">
          <Button variant="outline-dark" onClick={() => navigateTo("/create")}>
            Create a Portfolio
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => navigateTo("/portfolios")}
          >
            Browse Portfolios
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
