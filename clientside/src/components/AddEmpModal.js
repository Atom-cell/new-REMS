import React from "react";
import axios from "axios";
import { Modal, Box, TextField } from "@mui/material";
import { Button } from "react-bootstrap";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function AddEmpModal({ closeMod, addEmpModal, currency }) {
  const [email, setEmail] = React.useState("");
  const [hourlyRate, setHourlyRate] = React.useState();
  const [emailE, setemailE] = React.useState({ error: false, msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let NewItem = { name: itemName };
    console.log("handle submit ", emailE);
    if (emailE.error === false && email !== "") {
      await axios
        .post(
          "http://localhost:5000/emp/register",
          {
            email: email,
            hourlyRate: hourlyRate,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then(function (response) {
          console.log(response);
          addEmpModal(response.data.msg);
          //setResponse(response.data.msg);
          closeMod();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      //alert("sd");
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

    console.log("Check ", emailE);
  };
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={true}
        onClose={() => closeMod()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Add a New Employee</h3>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <TextField
              id="standard-basic"
              error={emailE.error}
              label="Email"
              variant="outlined"
              value={email}
              margin="dense"
              type="text"
              helperText={emailE.msg}
              className="ip"
              placeholder="Enter Employee Email"
              onChange={(e) => {
                setEmail(e.target.value);
                checkEmail();
              }}
            />
            <TextField
              id="standard-basic"
              type="number"
              label={`Hourly Rate in ${currency?.symbol}`}
              variant="outlined"
              value={hourlyRate}
              margin="dense"
              className="ip"
              placeholder="Enter Employee Hourly Rate in $"
              onChange={(e) => {
                setHourlyRate(e.target.value);
                // checkEmail();
              }}
            />
            <div style={{ width: "100%" }}>
              <Button type="submit" variant="contained" className="submitbtn">
                Add
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default AddEmpModal;
