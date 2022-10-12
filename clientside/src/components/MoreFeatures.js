import React from "react";
import "./MoreFeatures.css";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import features from "./features";
import AnimatedRoutes from "../AnimatedRoutes";

function MoreFeatures() {
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <AnimatedRoutes>
      <div style={{ overflowX: "hidden" }}>
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
            <div>
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
            </div>
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
    </AnimatedRoutes>
  );
}

export default MoreFeatures;
