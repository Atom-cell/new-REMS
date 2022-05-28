import React from "react";
import "./MoreFeatures.css";
import "./Download.css";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import img from "../img/Capture.PNG";

import FileDownload from "js-file-download";
import axios from "axios";

function Download() {
  let navigate = useNavigate();
  const downloadFile = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:5000/emp/download",
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      FileDownload(response.data, "REMSSetup.msi");
    });
  };
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
            {window.screen.width > 768 ? (
              <Button
                className="signbtn"
                type="button"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            ) : null}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="downloadWrapper">
        <Row>
          <Col xs={12} md={6} className="img">
            <Image src={img} className="headerimg" />
          </Col>
          <Col xs={12} md={6} className="downloadbtnwrapper">
            <h1>Download the Desktop App</h1>
            <Button className="windows" onClick={(e) => downloadFile(e)}>
              Get for Windows
            </Button>
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
