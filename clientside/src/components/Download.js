import React from "react";
import "./MoreFeatures.css";
import "./Download.css";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import img from "../img/Capture.png";
import AnimatedRoutes from "../AnimatedRoutes";
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
    <AnimatedRoutes>
      <div>
        <Container className="downloadWrapper">
          <Row>
            <Col xs={12} md={6} className="img">
              <Image src={img} className="headerimg2" />
            </Col>
            <Col xs={12} md={5} className="downloadbtnwrapper">
              <h1>Download the Desktop App</h1>
              <Button className="windows" onClick={(e) => downloadFile(e)}>
                Get for Windows
              </Button>
              {/* <Button className="ios">Coming Soon...</Button> */}
            </Col>
          </Row>
        </Container>
      </div>
    </AnimatedRoutes>
  );
}

export default Download;
