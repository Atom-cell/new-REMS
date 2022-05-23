import React from "react";
import "./UpdateProfile.css";
import {
  TextField,
  Snackbar,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import axios from "axios";
function UpdateProfile() {
  const [username, setUsername] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [bank, setBank] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contactE, setcontactE] = React.useState({ error: false, msg: "" });
  const [passwordE, setpasswordE] = React.useState({ error: true, msg: "" });

  const [showPass, setShowPass] = React.useState(false);
  const [data, setData] = React.useState(9);
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e) => {
    setpasswordE({ error: false, msg: "" });
    setcontactE({ error: false, msg: "" });

    e.preventDefault();
    uploadData();
  };

  const uploadData = async () => {
    if (
      bank &&
      password.length >= 8 &&
      username &&
      /[0-9]{4}-[0-9]{7}/.test(contact)
    ) {
      axios
        .put("http://localhost:5000/emp/update", {
          email: localStorage.getItem("email"),
          username: username,
          password: password,
          contact: contact,
          bank: bank,
        })
        .then(function (response) {
          setData(response.data.msg);
        })
        .catch(function (error) {
          console.log(error);
        });

      setPassword("");
      setUsername("");
      setBank("");
      setContact("");
      setOpen(true);

      setpasswordE({ error: false, msg: "" });
      setcontactE({ error: false, msg: "" });

      setTimeout(function () {
        window.location.href = "/home";
      }, 2000);
    }
  };

  const checkContact = () => {
    if (/[0-9]{4}-[0-9]{7}/.test(contact)) {
      setcontactE({ error: false, msg: "" });
      //alert("good");
    } else {
      setcontactE({
        ...contactE,
        error: true,
        msg: "Please enter a valid contact number.",
      });
      //alert("bad");
    }
  };

  const checkPassword = () => {
    if (password.length < 8) {
      setpasswordE({
        ...passwordE,
        error: true,
        msg: "Please enter a valid password.",
      });
    } else {
      setpasswordE({ error: false, msg: "" });
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
  return (
    <div className="container1">
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Updated Successfully!
        </Alert>
      </Snackbar>

      <h2>Update Profile</h2>
      <div className="formcontainer">
        <form action="" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            id="standard-basic"
            label="Full Name"
            variant="outlined"
            margin="dense"
            value={username}
            type="text"
            className="ip"
          />

          <TextField
            error={passwordE.msg}
            onChange={(e) => setPassword(e.target.value)}
            id="standard-basic"
            label="Password"
            variant="outlined"
            onBlur={checkPassword}
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
            helperText={"Password should be greater than 8 characters"}
            type={showPass ? "text" : "password"}
            className="ip"
          />
          <TextField
            error={contactE.msg}
            onChange={(e) => setContact(e.target.value)}
            onBlur={checkContact}
            helperText={contactE.msg}
            id="standard-basic"
            label="Contact Number"
            variant="outlined"
            margin="dense"
            value={contact}
            placeholder="0xxx-xxxxxxx"
            type="tel"
            className="ip"
          />
          <TextField
            onChange={(e) => setBank(e.target.value)}
            id="standard-basic"
            label="Bank Details"
            variant="outlined"
            value={bank}
            margin="dense"
            multiline
            className="ip"
          />

          <div style={{ width: "100%" }}>
            <Button type="submit" variant="contained" className="submitbtn">
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
