import React from "react";
import "./MoreFeatures.css";
import "./Download.css";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Container, Row, Col, Image, Button } from "react-bootstrap";

function Download() {
  return (
    <div>
      <Navbar expand="sm" className="appbar">
        <Container>
          <Navbar.Brand className="rems">REMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="one">
                Home
              </Nav.Link>
              <Nav.Link href="/features" className="two">
                Features
              </Nav.Link>
              <Nav.Link href="/download" className="three">
                Download
              </Nav.Link>
              <Nav.Link href="/login" className="four">
                Login
              </Nav.Link>
            </Nav>
            {/* <Nav.Link className="four">Login</Nav.Link> */}
            <Button className="signbtn" type="button">
              Get Started
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="downloadWrapper">
        <Row>
          <Col xs={12} md={6} className="img">
            <h1>Download the Desktop App</h1>
            <Button className="windows">Get for Windows</Button>
            <Button className="ios">Coming Soon...</Button>
          </Col>
          <Col xs={12} md={6} className="downloadbtnwrapper">
            <h1>Download the Desktop App</h1>
            <Button className="windows">Get for Windows</Button>
            <Button className="ios">Coming Soon...</Button>
          </Col>
        </Row>
      </Container>
      <>
        <Row>
          <Col xs={12}>
            <div className="footer">
              <h1>Start monitoring with REMS!</h1>
              <Button>Creat Free Account Now</Button>
              <p>Remote Employee Monitoring System</p>
            </div>
          </Col>
        </Row>
      </>
    </div>
  );
}

export default Download;
