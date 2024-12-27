import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import Navbar from "../../components/navbar/Navbar";

import "./PortfolioSummary.css";

function PortfolioSummary() {
  const { id } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    fetch(`/portfolio/${id}`)
      .then((response) => response.json())
      .then((data) => setPortfolioData(data))
      .catch((error) =>
        console.error("Error fetching portfolio data: ", error)
      );
  }, [id]);

  if (!portfolioData) return <p>Loading portfolio summary...</p>;

  return (
    <div>
      <Navbar></Navbar>
      <div className="portfolio-summary-container">
        <h1>Portfolio Summary</h1>
        <Card>
          <Card.Body>
            <pre>{JSON.stringify(portfolioData, null, 2)}</pre>{" "}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default PortfolioSummary;
