import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

import "./Navbar.css";

function AppNavbar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="sm" expanded={expanded} onToggle={setExpanded}>
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
            {expanded ? (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Item>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-dark"
                    className="me-2"
                  >
                    Login
                  </Button>
                </Nav.Item>
                <Nav.Item>
                  <Button as={Link} to="/signup" variant="dark">
                    Signup
                  </Button>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
