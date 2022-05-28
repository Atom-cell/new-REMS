import React from "react";
import "./MoreFeatures.css";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import features from "./features";

function MoreFeatures() {
  const navigate = useNavigate();
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
      {/* Feature 1 */}
      <Container>
        <Row>
          <Col xs={12}>
            <h1 className="featuretitle">Features</h1>
          </Col>
          <Col xs={12} className="ftnames">
            <h5>
              <a href="#user">User Manangement</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#activity">Activity Monitor</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#dashboard">Dashboard</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#project">Project Management</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#time">Time Tracking</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#calendar">Calendar & Meetups</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#report">Report</a>
              <FiberManualRecordOutlinedIcon fontSize="small" />
              <a href="#billing">Billing</a>
            </h5>
          </Col>
        </Row>
      </Container>

      {features.map((ft, index) => {
        return (
          <Container>
            <Row>
              {index % 2 === 0 ? (
                <>
                  <Col xs={12} md={6} className="ft1img">
                    <Image src={ft.img} className="headerimg" />
                  </Col>
                  <Col xs={12} md={6} id={ft.id}>
                    <div className="ft1">
                      <h1>{ft.title}</h1>
                      <p>{ft.description}</p>
                    </div>
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={12} md={6} id={ft.id}>
                    <div className="ft1">
                      <h1>{ft.title}</h1>
                      <p>{ft.description}</p>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="ft1img">
                    <Image src={ft.img} className="headerimg" />
                  </Col>
                </>
              )}
            </Row>
          </Container>
        );
      })}

      <>
        <Row style={{ backgroundColor: "red" }}>
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

export default MoreFeatures;
