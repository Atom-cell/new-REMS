import React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const MoreEvents = ({ show, handleClose, moreEvents, eventSelected }) => {
  console.log(moreEvents);
  //title,startDate,category
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>More Events</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {moreEvents.map((event) => {
                return (
                  <tr key={event._id} onClick={() => eventSelected(event)}>
                    <td>{event.title}</td>
                    <td>{event.category}</td>
                    <td>{event.startDate.substring(0, 10)}</td>
                    <td>{event.startDate.substring(11, 16)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MoreEvents;
