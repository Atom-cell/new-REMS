import React from "react";
import axios from "axios";
import { Modal, Box } from "@mui/material";
import { Spinner } from "react-bootstrap";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  p: 4,
  bgcolor: "background.paper",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
function LoadingModal({ closeMod, prod }) {
  return (
    <div>
      <Modal
        open={true}
        onClick={() => closeMod()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {prod < 60 ? (
            <h3 style={{ color: "#f70d1a" }}>Red Zone</h3>
          ) : prod > 60 && prod < 80 ? (
            <h3 style={{ color: "yellow" }}>Yellow Zone</h3>
          ) : prod > 80 ? (
            <h3 style={{ color: "#1fd655" }}>Green Zone</h3>
          ) : null}

          <h4
            style={
              prod < 60
                ? { color: "#f70d1a" }
                : prod > 60 && prod < 80
                ? { color: "yello" }
                : prod > 80
                ? { color: "#1fd655" }
                : null
            }
          >
            {prod}%
          </h4>
        </Box>
      </Modal>
    </div>
  );
}

export default LoadingModal;
