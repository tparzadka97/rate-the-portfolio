import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Navbar from "../../components/navbar/Navbar";

import "./CreatePortfolio.css";

function CreatePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [newHolding, setNewHolding] = useState({
    type: "stock",
    name: "",
    amount: "",
  });
  const [isSynced, setIsSynced] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  function getCSRFToken() {
    const csrfToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("csrftoken="));
    return csrfToken ? csrfToken.split("=")[1] : null;
  }

  const handleSyncWithRobinhood = async (event) => {
    event.preventDefault();

    try {
      const userCredentials = {
        username: "",
        password: "",
      };
      const csrfToken = getCSRFToken();

      const response = await fetch("/portfolio/sync-robinhood/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(userCredentials),
      });

      if (response.ok) {
        const data = await response.json();
        setHoldings(data.holdings);
        setIsSynced(true);
        setFormError("");
      } else {
        const errorData = await response.json();
        console.error("Sync failed:", errorData.error);
        setFormError("Failed to sync with Robinhood. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("An error occurred while syncing with Robinhood.");
    }
  };

  const handleAddHolding = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    // Only add holding if all fields are valid
    if (newHolding.name && newHolding.amount > 0) {
      setHoldings((prevHoldings) => [...prevHoldings, newHolding]);
      setNewHolding({ type: "stock", name: "", amount: "" }); // Reset form fields after adding
      setValidated(false); // Clear validation feedback after successful addition
    }
  };

  const handleSubmitPortfolio = (event) => {
    if (holdings.length === 0) {
      event.target.blur();

      setFormError("You must add at least one holding before submitting.");
      return; // Prevent submission
    }

    setFormError(""); // Clear any previous errors
    // Handle the final portfolio submission here (API call or other action)
    console.log("Portfolio submitted:", holdings);
    // You can navigate to a different page after submission if needed
    navigate("/portfolio-summary");
  };

  return (
    <div>
      <Navbar />
      <div className="create-portfolio-container">
        <h1>Create Your Portfolio</h1>

        {/* Sync with Robinhood Button */}
        <Button className="sync-btn" onClick={handleSyncWithRobinhood}>
          Sync with Robinhood
        </Button>

        {isSynced && <p>Synced with Robinhood successfully!</p>}

        {/* Form to Add Holdings */}
        <Form
          className="add-holding-form"
          noValidate
          validated={validated}
          onSubmit={handleAddHolding}
        >
          <Form.Group className="holding-group">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={newHolding.type}
              onChange={(e) =>
                setNewHolding({ ...newHolding, type: e.target.value })
              }
            >
              <option value="stock">Stock</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="cash">Cash</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="holding-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the name (e.g., AAPL, BTC, USD)"
              value={newHolding.name}
              onChange={(e) =>
                setNewHolding({ ...newHolding, name: e.target.value })
              }
              required
              isInvalid={validated && !newHolding.name}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a name.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Display different fields based on the type */}
          {newHolding.type !== "cash" ? (
            <Form.Group className="holding-group">
              <Form.Label>
                Number of {newHolding.type === "stock" ? "Shares" : "Coins"}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder={`Enter the number of ${
                  newHolding.type === "stock" ? "shares" : "coins"
                }`}
                value={newHolding.amount}
                onChange={(e) =>
                  setNewHolding({ ...newHolding, amount: e.target.value })
                }
                min="1"
                required
                isInvalid={validated && newHolding.amount <= 0}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid amount (greater than 0).
              </Form.Control.Feedback>
            </Form.Group>
          ) : (
            <Form.Group className="holding-group">
              <Form.Label>Value ($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the value in dollars"
                value={newHolding.amount}
                onChange={(e) =>
                  setNewHolding({ ...newHolding, amount: e.target.value })
                }
                min="0"
                required
                isInvalid={validated && newHolding.amount <= 0}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid value (greater than 0).
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Button className="holdings-btn" variant="success" type="submit">
            Add Holding
          </Button>
        </Form>

        {/* Holdings Table */}
        <Table striped bordered hover className="holdings-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <tr key={index}>
                <td>{holding.type}</td>
                <td>{holding.name}</td>
                <td>{holding.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Submit Button */}
        <div className="submit-btn-container">
          <div className="submit-btn-wrapper">
            <Button onClick={handleSubmitPortfolio} className="submit-btn">
              Submit Portfolio
            </Button>
            {formError && <p className="error-message">{formError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePortfolio;
