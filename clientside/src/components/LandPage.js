import React from "react";
import "./LandPage.css";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// import img from "../img/undraw_Dev_focus_re_6iwt.png";
import img from "../img/remote work.png";
import img2 from "../img/Working remotely.gif";
import img3 from "../img/Telecommuting.gif";
import apps from "../img/app-web.png";
import time from "../img/timetrack.png";
import proj from "../img/projectmanage.png";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function LandPage() {
  let navigate = useNavigate();
  const [ref1, inView1] = useInView({ threshold: 0.2 });
  const [ref2, inView2] = useInView({ threshold: 0.3 });
  const [ref3, inView3] = useInView({ threshold: 0.2 });

  const animation = useAnimation();
  const animation2 = useAnimation();
  const animation3 = useAnimation();

  React.useEffect(() => {
    if (inView1) {
      animation.start({
        x: 0,
        transition: {
          type: "spring",
          duration: 2,
          bounce: 0.3,
        },
        // initial: { opacity: 0 },
        // animate: { opacity: 1 },
        // transition: { duration: 2, delay: 0.2 },
      });
    }
    if (inView2) {
      animation2.start({
        x: -0,
        transition: {
          type: "spring",
          duration: 2,
          bounce: 0.3,
        },
      });
    }
    if (inView3) {
      animation3.start({
        x: 0,
        transition: {
          type: "spring",
          duration: 2,
          bounce: 0.3,
        },
      });
    }

    if (!inView1) {
      animation.start({
        x: "-100vw",
      });
    }
    if (!inView2) {
      animation2.start({
        x: "100vw",
      });
    }
    if (!inView3) {
      animation3.start({
        x: "-100vw",
      });
    }
  }, [inView1, inView2, inView3]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.7, delay: 0.2 }}
      >
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
              <Image src={img3} className="headerimg" />
            </Col>
          </Row>
        </Container>
      </motion.div>
      {/* Feature 1 */}
      <div ref={ref1}>
        <Container>
          <motion.div animate={animation}>
            <Row>
              <Col xs={12} md={6} className="ft1img">
                <Image src={apps} className="headerimg2" />
              </Col>
              <Col xs={12} md={6}>
                <div className="ft1">
                  <h1>01</h1>
                  <h1>Monitor the apps your employees use, in realtime</h1>

                  <details>
                    <summary style={{ backgroundColor: "green" }}>
                      Working hard or browsing social media? Always know how
                      your employees use their time. Track app and website
                      usage, and overall productivity.
                    </summary>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Enim, iste corporis! Minus enim soluta repudiandae at
                      dolores, recusandae incidunt natus libero rem, numquam
                      obcaecati quod qui mollitia placeat voluptas totam.
                    </p>
                  </details>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>

      {/* Feature 2 */}
      <div ref={ref2}>
        <Container>
          <motion.div animate={animation2}>
            <Row>
              <Col xs={12} md={6}>
                <div className="ft1">
                  <h1>02</h1>
                  <h1>Keep track of the time used to do the work.</h1>
                  <p>
                    Want to pay according to the time used to the work? Want to
                    pay fairly? Time Tracking will help you do so.
                  </p>
                </div>
              </Col>
              <Col xs={12} md={6} className="ft1img">
                <Image src={time} className="headerimg2" />
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>

      {/* Feature 3 */}
      <div ref={ref3}>
        <Container>
          <motion.div animate={animation3}>
            <Row>
              <Col xs={12} md={6} className="ft1img">
                <Image src={proj} className="headerimg2" />
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
          </motion.div>
        </Container>
      </div>
      <Container>
        <Row>
          <Col xs={12} className="more">
            <Button onClick={() => navigate("/features")}>
              More Features
              <ChevronRightIcon style={{ fill: "white" }} />
            </Button>
          </Col>
        </Row>
      </Container>
      <>
        <Row>
          <Col xs={12}>
            <div className="footer">
              <h1>Start monitoring your remote employees now!</h1>
              {window.screen.width > 768 ? (
                <Button
                  onClick={() => navigate("/signup")}
                  className="footerbtn"
                  style={{ border: "1px solid white" }}
                >
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
