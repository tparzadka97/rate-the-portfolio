import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import "./Navbar.css";

function AppNavbar() {
  return (
    <Navbar expand="sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Rate the Portfolio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Item className="me-auto">
              <Nav.Link as={Link} to="/login" className="login-btn">
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="me-auto">
              <Nav.Link as={Link} to="/signup" className="signup-btn">
                Signup
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
