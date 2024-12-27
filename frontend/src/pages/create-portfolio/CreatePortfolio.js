import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Navbar from "../../components/navbar/Navbar";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import "./CreatePortfolio.css";

function CreatePortfolio() {
  const [holdings, setHoldings] = useState([]);
  const [newHolding, setNewHolding] = useState({
    type: "stock",
    name: "",
    amount: "",
  });
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [portfolioName, setPortfolioName] = useState("My Portfolio");

  const navigate = useNavigate();

  function getCSRFToken() {
    const csrfToken = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("csrftoken="));
    return csrfToken ? csrfToken.split("=")[1] : null;
  }

  const handleSyncWithRobinhood = async (event) => {
    event.preventDefault();
    setShowModal(false);
    setIsSyncing(true);

    try {
      const userCredentials = {
        username,
        password,
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
        setToastMessage("Synced with Robinhood successfully!");
        setToastVariant("success");
        setFormError("");
      } else {
        const errorData = await response.json();
        console.error("Sync failed: ", errorData.error);
        setToastMessage("Failed to sync with Robinhood. Please try again.");
        setToastVariant("danger");
        setFormError("Failed to sync with Robinhood. Please try again.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setToastMessage("An error occurred while syncing with Robinhood.");
      setToastVariant("danger");
      setFormError("An error occurred while syncing with Robinhood.");
    } finally {
      setIsSyncing(false);
      setShowToast(true);
    }
  };

  const handleAddHolding = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (newHolding.name && newHolding.amount > 0) {
      setHoldings((prevHoldings) => [...prevHoldings, newHolding]);
      setNewHolding({ type: "stock", name: "", amount: "" });
      setValidated(false);
    }
  };

  const handleSubmitPortfolio = async (event) => {
    event.preventDefault();

    if (!portfolioName) {
      setFormError("You must add a portfolio name.");
      return;
    }

    if (holdings.length === 0) {
      setFormError("You must add at least one holding before submitting.");
      return;
    }

    const portfolioData = {
      name: portfolioName,
      holdings: holdings,
    };

    try {
      const csrfToken = getCSRFToken();
      const response = await fetch("/portfolio/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ portfolio: portfolioData }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/portfolio-summary/${data.id}`);
      } else {
        const errorData = await response.json();
        setFormError(errorData.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting portfolio: ", error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="create-portfolio-container">
        <h1>Create Your Portfolio</h1>
        {!isSynced && (
          <Button
            className={`sync-btn ${isSyncing ? "syncing" : ""}`}
            onClick={() => setShowModal(true)}
            disabled={isSyncing}
            style={
              isSyncing
                ? { backgroundColor: "#05c806", borderColor: "#05c806" }
                : {}
            }
          >
            {isSyncing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Syncing...
              </>
            ) : (
              "Sync with Robinhood"
            )}
          </Button>
        )}

        {/* Toast Notification */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            className={`toast-${toastVariant}`}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={4000}
            autohide
          >
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Modal for Robinhood Login */}
        <Modal
          className="robinhood-login-modal"
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Sync with Robinhood</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Robinhood username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your Robinhood password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button className="sync-btn" onClick={handleSyncWithRobinhood}>
              Sync
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Custom Portfolio Name */}
        <Form.Group className="portfolio-name-group">
          <Form.Label>Portfolio Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a name for your portfolio"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Form to Add Holdings */}
        <Form
          className="holding-form"
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
              <option value="other">Other</option>
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

          <Button variant="outline-dark" className="holding-btn" type="submit">
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
          <Button variant="outline-dark" onClick={handleSubmitPortfolio}>
            Submit Portfolio
          </Button>
        </div>

        {/* Toast for Error Messages */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setFormError("")} // Clear the error when the toast closes
            show={!!formError}
            delay={4000}
            autohide
            style={{ backgroundColor: "#dc3545", color: "white" }} // Red background and white text
          >
            <Toast.Body>{formError}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
}

export default CreatePortfolio;
