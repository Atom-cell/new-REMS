import React from "react";
import "./Signup.css";
import {
  TextField,
  FormControl,
  Input,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

// import { Form, Button } from "react-bootstrap";

function Signup() {
  React.useEffect(() => {
    if (window.screen.width < 768) {
      window.location = "/no";
    }
  }, []);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  //error messsages
  const [usernameE, setUsernameE] = React.useState({
    error: false,
    msg: "",
  });
  const [emailE, setemailE] = React.useState({ error: false, msg: "" });
  const [passwordE, setpasswordE] = React.useState({ error: false, msg: "" });
  const [resp, setResponse] = React.useState(9);
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    setUsernameE({ error: false, msg: "" });
    setemailE({ error: false, msg: "" });
    setpasswordE({ error: false, msg: "" });
    if (username === "") {
      setUsernameE({
        ...usernameE,
        error: true,
        msg: "Please enter a valid fullname.",
      });
    }
    if (email === "") {
      setemailE({
        ...emailE,
        error: true,
        msg: "Please enter an Email address.",
      });
    }
    if (password === "" || password.length < 8) {
      setpasswordE({
        ...passwordE,
        error: true,
        msg: "Please enter a valid password.",
      });
    }
    e.preventDefault();
    uploadData();
  };

  const uploadData = async () => {
    if (username && email && password.length >= 8) {
      if (!usernameE.error && !emailE.error && !passwordE.error) {
        await axios
          .post("http://localhost:5000/admin/register", {
            username: username,
            email: email,
            password: password,
          })
          .then(function (response) {
            console.log(response);
            setResponse(response.data.msg);
          })
          .catch(function (error) {
            console.log(error);
          });

        setpasswordE({
          ...passwordE,
          error: false,
          msg: "",
        });
        setemailE({
          ...emailE,
          error: false,
          msg: "",
        });
        setOpen(true);
        setUsername("");
        setEmail("");
        setPassword("");
      }
    }
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
    <div className="container1">
      {/* //////////// Login mai check if already reistered by finding in mongodb
      ///////////////// */}
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        {resp === 1 ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Account Created Successfully!
          </Alert>
        ) : resp === 0 ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            User already exists!
          </Alert>
        ) : null}
      </Snackbar>
      <h2>LOGO</h2>
      <h2>Sign up to REMS</h2>
      <div className="formcontainer">
        <form action="" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            error={usernameE.error}
            onChange={(e) => setUsername(e.target.value)}
            id="standard-basic"
            helperText={usernameE.msg}
            label="Full Name"
            variant="outlined"
            margin="dense"
            value={username}
            type="text"
            className="ip"
          />

          <TextField
            error={emailE.error}
            onChange={(e) => setEmail(e.target.value)}
            id="standard-basic"
            onBlur={checkEmail}
            label="Email"
            value={email}
            variant="outlined"
            helperText={emailE.msg}
            margin="dense"
            type="text"
            className="ip"
          />
          <TextField
            error={passwordE.error}
            onChange={(e) => setPassword(e.target.value)}
            id="standard-basic"
            label="Password"
            value={password}
            variant="outlined"
            margin="dense"
            helperText={
              passwordE.error
                ? passwordE.msg
                : "Password should be atleast 8 characters."
            }
            type="password"
            className="ip"
          />
          <p className="para">
            If you are an employee, DO NOT register here. Employees will get an
            invite link to signin.
          </p>
          <Button type="submit" variant="contained" className="submitbtn">
            Create an Admin Account
          </Button>
        </form>

        <p className="para">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
