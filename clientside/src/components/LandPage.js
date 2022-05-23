import React from "react";
import "./LandPage.css";
import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import img from "../img/undraw_Dev_focus_re_6iwt.png";
import apps from "../img/app-web.PNG";
import time from "../img/timetrack.PNG";
import proj from "../img/projectmanage.PNG";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button2 from "@mui/material/Button";

function LandPage() {
  let navigate = useNavigate();
  return (
    <div style={{ overflowX: "hidden" }}>
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
              {window.screen.width > 768 ? (
                <Nav.Link href="/login" className="four">
                  Login
                </Nav.Link>
              ) : null}
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
      {/* header */}
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <div className="header-text">
              <h1>100% free employee monitoring and timesheets</h1>
              <h2>with REMS</h2>
              <p>
                Boost your team productivity by 2x with an intelligent
                monitoring system
              </p>
            </div>
            <div className="header-features">
              <h4>Activity Monitoring</h4>
              <h4>Time Tracking</h4>
              <h4>Project Management</h4>
            </div>
            {window.screen.width > 768 ? (
              <Button
                className="signbtn2"
                type="button"
                onClick={() => navigate("/signup")}
              >
                Start Monitoring. It's free!
              </Button>
            ) : null}
          </Col>
          <Col xs={12} md={6}>
            <Image src={img} className="headerimg" />
          </Col>
        </Row>
      </Container>
      {/* Feature 1 */}
      <Container>
        <Row>
          <Col xs={12} md={6} className="ft1img">
            <Image src={apps} className="headerimg" />
          </Col>
          <Col xs={12} md={6}>
            <div className="ft1">
              <h1>01</h1>
              <h1>Monitor the apps your employees uses, in realtime</h1>
              <p>
                Working hard or browsing social media? Always know how your
                employees use their time. Track app and website usage, and
                overall productivity.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Feature 2 */}
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <div className="ft1">
              <h1>02</h1>
              <h1>Keep track of the time used to do the work.</h1>
              <p>
                Want to pay according to the time used to the work? Want to pay
                fairly? Time Tracking will help you do so.
              </p>
            </div>
          </Col>
          <Col xs={12} md={6} className="ft1img">
            <Image src={time} className="headerimg" />
          </Col>
        </Row>
      </Container>

      {/* Feature 3 */}
      <Container>
        <Row>
          <Col xs={12} md={6} className="ft1img">
            <Image src={proj} className="headerimg" />
          </Col>
          <Col xs={12} md={6}>
            <div className="ft1">
              <h1>03</h1>
              <h1>Manage and assign work</h1>
              <p>
                Keep an eye on all the projects underway. Create projects,
                Manage projects, Assign projects in Project Management
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col xs={12} className="more">
            {/* <Button>
              More Features <ChevronRightIcon color="action" />
            </Button> */}
            <Button2
              onClick={() => navigate("/features")}
              variant="contained"
              endIcon={<ChevronRightIcon />}
            >
              More Features
            </Button2>
          </Col>
        </Row>
      </Container>
      <>
        <Row style={{ backgroundColor: "red" }}>
          <Col xs={12}>
            <div className="footer">
              <h1>Start monitoring your remote employees now!</h1>
              {window.screen.width > 768 ? (
                <Button onClick={() => navigate("/signup")}>
                  Creat Free Account Now
                </Button>
              ) : null}
            </div>
          </Col>
        </Row>
      </>
    </div>
  );
}

export default LandPage;
