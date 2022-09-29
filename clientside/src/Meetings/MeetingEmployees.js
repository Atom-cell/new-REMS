import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import GroupsIcon from "@mui/icons-material/Groups";
const MeetingEmployees = ({ employees, title }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        View
      </Button> */}
      <div className="all-meeting-row-delete-icon">
        <GroupsIcon onClick={handleShow} />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`${title} Members`}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="meeting-employees-body">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {employees?.map((name, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MeetingEmployees;
