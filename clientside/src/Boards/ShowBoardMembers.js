import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const ShowBoardMembers = ({ bid, selectedEmployees }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ marginTop: "10px", marginRight: "0.5rem", height: "40px" }}
      >
        Show Members
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="meeting-employees-table">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedEmployees?.map((nam, index) => {
                  console.log(nam);
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{nam}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
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

export default ShowBoardMembers;
