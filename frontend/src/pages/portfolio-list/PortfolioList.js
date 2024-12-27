import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Navbar from "../../components/navbar/Navbar";

import "./PortfolioList.css";

function PortfolioList() {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    fetch("/portfolio/list/")
      .then((response) => response.json())
      .then((data) => setPortfolios(data))
      .catch((error) => console.error("Error fetching portfolios: ", error));
  }, []);

  return (
    <div>
      <Navbar></Navbar>
      <div className="portfolio-list-container">
        <h1>All Portfolios</h1>
        {portfolios.length === 0 ? (
          <p>No portfolios found.</p>
        ) : (
          <div className="portfolio-list">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="portfolio-card">
                <Card.Body>
                  <Card.Title>{portfolio.name}</Card.Title>
                  <Card.Text>{portfolio.holdings.length} Holdings</Card.Text>
                  <Link to={`/portfolio-summary/${portfolio.id}`}>
                    <Button variant="outline-dark">View Portfolio</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioList;
