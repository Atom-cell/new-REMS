import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const ShowBoardMembers = ({ bid, selectedEmployees }) => {
  const [show, setShow] = useState(false);
  const [members, setMembers] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    axios
      .get("/myBoards//getsharewith/employees", { params: { bid: bid } })
      .then((res) => setMembers(res.data[0].sharewith))
      .catch((err) => console.log(err));
  }, [selectedEmployees]);

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
                {members?.map((nam, index) => {
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
