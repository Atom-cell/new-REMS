import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import { Badge } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import axios from "axios";
const CommunicationNotification = ({
  allNotifications,
  setAllNotifications,
  unreadNotifications,
  setUnreadNotifications,
  fetchData,
}) => {
  const readAll = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .post("/notif/readall", {
        userId: user._id,
        notifications: allNotifications,
      })
      .then((rec) => {
        console.log(rec.data);
        if (rec.data === "Success") {
          fetchData();
        }
      })
      .catch((err) => console.log(err + "At 176 in Messenger"));
  };

  return (
    <div>
      <Dropdown className="sidebarmenu-dropdown">
        <Dropdown.Toggle style={{ all: "unset", cursor: "pointer" }}>
          <IconButton>
            <Badge badgeContent={unreadNotifications} color="error">
              <MailIcon style={{ fill: "white" }} />
            </Badge>
          </IconButton>
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{
            maxHeight: "25em",
            overflowY: "auto",
          }}
        >
          <Dropdown.Item style={{ marginTop: "0.4em", marginBottom: "0.4em" }}>
            <Button>Refresh</Button>
          </Dropdown.Item>
          {allNotifications?.map((n, i) => {
            return (
              <>
                <Dropdown.Item
                  href={n.path}
                  key={i}
                  style={{ marginTop: "0.4em", marginBottom: "0.4em" }}
                >
                  {n.msg}
                </Dropdown.Item>
                <Divider />
              </>
            );
          })}
          <Dropdown.Item style={{ marginTop: "0.4em", marginBottom: "0.4em" }}>
            <Button onClick={() => readAll()}>Read All</Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default CommunicationNotification;
