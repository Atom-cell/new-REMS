import React from "react";
import "./Signup.css";
import {
  TextField,
  Snackbar,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Image } from "react-bootstrap";
import Visibility from "@mui/icons-material/Visibility";
import axios from "axios";
import LoginImg from "../img/Login.gif";
import AnimatedRoutes from "../AnimatedRoutes";
import { baseURL } from "../Request";
import { toast } from "react-toastify";

function Login() {
  React.useEffect(() => {
    if (window.screen.width < 768) {
      window.location = "/no";
    }
  }, []);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailE, setemailE] = React.useState({ error: false, msg: "" });
  const [passwordE, setpasswordE] = React.useState({ error: false, msg: "" });
  const [showPass, setShowPass] = React.useState(false);
  const [valid, setValid] = React.useState(9);
  const [data, setData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e) => {
    setemailE({ error: false, msg: "" });
    setpasswordE({ error: false, msg: "" });

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
    if (email && password.length >= 8) {
      if (!emailE.error && !passwordE.error) {
        //alert("dd");
        await axios
          .post(`${baseURL}/emp/login`, {
            email: email,
            password: password,
          })
          .then(function (response) {
            // console.log(response.data.data);
            // console.log(response.data.token);
            setValid(response.data.msg);
            //for updating info email is needed
            setData(response.data.data);
            localStorage.setItem("token", response.data.token);
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

        setEmail("");
        setPassword("");

        setOpen(true);
      }
    }
  };

  const filterNotifications = (n) => {
    return (n = n.filter((s) => s.flag === 0));
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

  const showPassword = () => {
    setShowPass(!showPass);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const checkAuth = () => {
    axios
      .get("http://localhost:5000/emp/checkAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Response: ", response);
      });
  };

  const forward = () => {
    if (data.role === "admin" && !data.verified)
      alert("Please Verify your Credentials");
    else if (data.role === "admin" && data.verified) {
      saveInfo(data);
      window.location = "/dashboard";
    } else if (data.role === "Employee" && data.updated === false) {
      saveInfo(data);
      window.location = "/update";
    } else if (data.role === "Employee" && data.updated && data.desktop) {
      saveInfo(data);
      window.location = "/empdashboard";
    } else if (data.role === "Employee" && !data.desktop)
      alert("Login on desktop first!");
  };

  const saveInfo = (data) => {
    localStorage.setItem("email", data.email);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("role", data.role);
    localStorage.setItem("id", data._id);
    let n = data.notifications;
    let rev = filterNotifications(n.reverse());
    //push db notifs in here
    localStorage.setItem("notif", JSON.stringify([...rev]));
    localStorage.setItem("notifNum", rev.length);
  };
  return (
    <AnimatedRoutes>
      <div className="container1">
        {valid === 0 ? (
          <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              Invalid Credentials!
            </Alert>
          </Snackbar>
        ) : (
          forward()
        )}
        {/* {valid === 0 ? (
          <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              Invalid Credentials!
            </Alert>
          </Snackbar>
        ) : data.role === "admin" && !data.verified ? (
          alert("Please Verify your Credentials")
        ) : data.role === "admin" && data.verified ? (
          (window.location = "/dashboard")
        ) : data.updated === false ? (
          (window.location = "/update")
        ) : data.updated && data.desktop ? (
          (window.location = "/empdashboard")
        ) : !data.desktop ? (
          alert("Login on desktop first!")
        ) : null} */}

        <div style={{ display: "flex", marginTop: "-2em" }}>
          <Image src={LoginImg} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Login to REMS</h2>
            <form
              action=""
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                error={emailE.error}
                onChange={(e) => setEmail(e.target.value)}
                id="standard-basic"
                onBlur={checkEmail}
                label="Email"
                variant="outlined"
                value={email}
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
                variant="outlined"
                margin="dense"
                value={password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPassword}>
                        <Visibility />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={passwordE.msg}
                type={showPass ? "text" : "password"}
                className="ip"
              />
              <div style={{ width: "100%" }}>
                <Button type="submit" variant="contained" className="submitbtn">
                  Login
                </Button>
              </div>
            </form>

            <p className="para">
              <a href="/forget" style={{ fontWeight: "bold" }}>
                Forgot Password?
              </a>
            </p>
            <p className="para">
              Not yet Registered? <a href="/signup">Signup</a>
            </p>
          </div>
        </div>
      </div>
    </AnimatedRoutes>
  );
}

export default Login;
