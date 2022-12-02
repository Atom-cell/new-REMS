import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
const TeamsSelectTable = ({ team, setTeam, handleClosee }) => {
  const [allTeams, setAllTeams] = useState();
  const handleSelect = (t) => {
    setTeam(t);
    console.log(t);
    handleClosee();
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {console.log(props)}
      Simple tooltip
    </Tooltip>
  );

  useEffect(() => {
    // get all teams
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`team/getTeams`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((rec) => {
        console.log(rec.data.data);
        setAllTeams(rec.data.data);
      })
      .catch((err) => console.log(err + "Line 15 in TeamsSelectTable"));
  }, []);

  return (
    <div className="chatBoxTop" style={{ height: "50vh", overflow: "scroll" }}>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Team Lead Name</th>
            <th>Team Members</th>
          </tr>
        </thead>
        <tbody>
          {allTeams?.map((t) => {
            return (
              <tr key={t._id} onClick={() => handleSelect(t)}>
                <td>{t.teamName}</td>
                <td>{t.teamLead.username}</td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Header as="h3">Members</Popover.Header>
                        <Popover.Body>
                          {t.members.map((m, index) => {
                            if (t.members.length === index + 1) {
                              return m.username;
                            } else {
                              return m.username + ",";
                            }
                          })}
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button>{t.members.length}</Button>
                  </OverlayTrigger>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TeamsSelectTable;
