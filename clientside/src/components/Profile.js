import React from "react";
import "./Profile.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { TextField, InputAdornment, IconButton, Avatar } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Visibility from "@mui/icons-material/Visibility";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

import dayjs from "dayjs";

const Profile = () => {
  const [data, setData] = React.useState();
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [bday, setBDay] = React.useState();
  const [phone, setPhone] = React.useState();
  const [pic, setPic] = React.useState(null);
  const [bank, setBank] = React.useState();
  const [gender, setGender] = React.useState("");
  const [password, setPassword] = React.useState();
  const [showPass, setShowPass] = React.useState(false);
  const [allEvents, setAllEvents] = React.useState([]); //for attendance
  const [valueCal, onChangeCal] = React.useState(new Date());
  const [role, setRole] = React.useState(localStorage.getItem("role"));

  React.useEffect(() => {
    getUserInfo();
  }, []);

  React.useEffect(() => {
    setName(data?.username);
    setEmail(data?.email);
    setBDay(data?.bday);
    setPhone(data?.contact);
    setPic(data?.profilePicture);
    setBank(data?.bankDetails);
    setGender(data?.gender);
    setAllEvents(data?.attendance);
  }, [data]);

  const getUserInfo = async () => {
    let id = localStorage.getItem("id");
    await axios
      .get(`http://localhost:5000/emp/getUserInfo/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  };

  const convertImage = (e) => {
    const file = e.target.files[0];

    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
      // Use a regex to remove data url part
      const base64String = reader.result
        .replace("data:", "")
        .replace(/^.+,/, "");

      console.log(base64String);
      setPic(base64String);
      // Logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name, email, bday, password, phone, pic);
    let role = localStorage.getItem("role");
    let id = localStorage.getItem("id");

    if (password) {
      if (name && email && bank && pic && bday && phone && gender) {
        let nn = new Date(bday);
        let birthday = nn?.toJSON().slice(0, 10);

        axios
          .post(`http://localhost:5000/emp/updateProfile/${role}/${id}`, {
            email: email,
            username: name,
            password: password,
            contact: phone,
            bank: bank,
            profilePicture: pic,
            bday: birthday,
            gender: gender,
          })
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
        toast.success("Profile Updated");
      } else {
        alert("fill all fields with password");
      }
    } else if (!password) {
      if (name && email && bank && pic && bday && phone && gender) {
        let nn = new Date(bday);
        let birthday = nn?.toJSON().slice(0, 10);

        axios
          .post(`http://localhost:5000/emp/updateProfile/${role}/${id}`, {
            email: email,
            username: name,
            contact: phone,
            bank: bank,
            profilePicture: pic,
            bday: birthday,
            gender: gender,
          })
          .then(function (response) {})
          .catch(function (error) {
            console.log(error);
          });
        toast.success("Profile Updated");
      } else {
        alert("fill all fields");
      }
    }
  };

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const checkPassword = (e) => {
    if (e.length < 8) {
      alert("enter password of 8 characters or more");
      setPassword("");
    }
  };
  const fixTimezoneOffset = (date) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="wrapper">
        <h3>Personal Information</h3>
        <div
          style={{
            position: "relative",
          }}
        >
          {pic ? (
            <Avatar
              alt="pp"
              src={`data:image/jpeg;base64,${pic}`}
              sx={{ width: 150, height: 150 }}
            />
          ) : (
            <Avatar
              src="https://i.stack.imgur.com/34AD2.jpg"
              alt="profile"
              className="info_pic"
            />
          )}

          {/*  */}
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            placeholder="Upload Profile Picture"
            onChange={(e) => convertImage(e)}
          ></input>
        </div>
        <div className="form_div">
          <form action="" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              onChange={(e) => setName(e.target.value)}
              id="standard-basic"
              placeholder="Username"
              variant="outlined"
              value={name}
              margin="dense"
              type="text"
              className="ip"
            />
            <div style={{ marginTop: "1em", display: "flex" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Birth date"
                  value={bday}
                  onChange={(newValue) => {
                    setBDay(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <FormControl sx={{ marginLeft: "2em", width: "20%" }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  placeholder="Age"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </div>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              id="standard-basic"
              placeholder="Email"
              variant="outlined"
              value={email}
              margin="dense"
              type="text"
              className="ip"
            />
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              id="standard-basic"
              placeholder="Password"
              variant="outlined"
              margin="dense"
              onBlur={(e) => checkPassword(e.target.value)}
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
              type={showPass ? "text" : "password"}
              className="ip"
            />

            <TextField
              onChange={(e) => setPhone(e.target.value)}
              id="standard-basic"
              placeholder="Phone #"
              variant="outlined"
              margin="dense"
              value={phone}
              type="text"
              className="ip"
            />
            <div className="bank_info">
              <TextField
                onChange={(e) => setBank(e.target.value)}
                sx={{ marginRight: "2em", width: "20%" }}
                id="standard-basic"
                placeholder="Bank Name & Account Number"
                variant="outlined"
                margin="dense"
                value={bank}
                type="text"
                className="ip"
              />
            </div>

            <div style={{ width: "100%" }}>
              <Button type="submit" className="submitbtn">
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
      {role !== "admin" ? (
        <div style={{ marginTop: "2em" }}>
          <h3>Attendance</h3>
          {allEvents ? (
            <Calendar
              value={valueCal}
              tileClassName={({ date }) => {
                if (
                  allEvents.find(
                    (x) =>
                      x.slice(0, 10) === fixTimezoneOffset(date).slice(0, 10)
                  )
                ) {
                  return "present";
                }
              }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
