import React from "react";
import "./ResetPassword.css";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";

function ResetPassword() {
  const [email, setEmail] = React.useState("");
  const [emailE, setemailE] = React.useState({ error: false, msg: "" });
  const [open, setOpen] = React.useState(false);
  const [resp, setResp] = React.useState(9);

  const handleSubmit = (e) => {
    setemailE({ error: false, msg: "" });

    if (email === "") {
      setemailE({
        ...emailE,
        error: true,
        msg: "Please enter an Email address.",
      });
    }
    e.preventDefault();
    if (email) {
      console.log(email);
      uploadData();
    }
  };

  const uploadData = async () => {
    //alert("dd");
    await axios
      .post("http://localhost:5000/emp/reset", {
        email: email,
      })
      .then(function (response) {
        console.log("RESP ", response.data.msg);
        setResp(response.data.msg);
      })
      .catch(function (error) {
        console.log(error);
      });

    setemailE({
      ...emailE,
      error: false,
      msg: "",
    });
    setOpen(true);
    setEmail("");
  };

  const checkEmail = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setemailE({ error: false, msg: "" });
    } else {
      setemailE({
        ...emailE,
        error: true,
        msg: "Please enter a valid Email address.",
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <div className="resetWrapper">
      <Button>Logo</Button>
      <h2 className="title">Reset Account Password</h2>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {resp === 1 ? (
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            Please check your email.
          </Alert>
        ) : resp === 0 ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            User does not exist!
          </Alert>
        ) : null}
      </Snackbar>
      <Row>
        <Col xs={12}>
          <form
            action=""
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            className="resetForm"
            // style={{ marginLeft: "20rem", marginRight: "20rem" }}
          >
            <p>Enter email here</p>
            <TextField
              error={emailE.error}
              onChange={(e) => {
                setEmail(e.target.value);
                checkEmail();
              }}
              id="standard-basic"
              onBlur={checkEmail}
              label="Email"
              variant="outlined"
              value={email}
              helperText={emailE.msg}
              margin="dense"
              type="text"
              className="ipField"
            />
            <div>
              <Button type="submit" variant="contained" className="submitbtn">
                Reset Account Password
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
  );
}

export default ResetPassword;
