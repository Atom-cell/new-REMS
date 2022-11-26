import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const ShowModal = ({
  event,
  setEvent,
  updateEvent,
  deleteEvent,
  editModalOpen,
  handleClosee,
  showMadeBy,
}) => {
  return (
    <div className="add-new-event-container">
      <Modal show={editModalOpen} onHide={handleClosee}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {showMadeBy && (
              <input
                type="text"
                placeholder="Event Made By"
                value={event?.madeBy}
                readOnly={true}
                // onChange={(e) => setEvent({ ...event, title: e.target.value })}
                className="inputTextFields"
              />
            )}
            <input
              type="text"
              placeholder="Add Event Title"
              value={event?.title}
              //   onChange={(e) => setEvent({ ...event, title: e.target.value })}
              readOnly={true}
              className="inputTextFields"
            />
            {/* <input type="text" value={event?.startDate} className="inputTextFields" onChange={(e) => setEvent({ ...event, startDate: e.target.value })}/> */}

            <DatePicker
              placeholderText="Start Date"
              selected={new Date(event?.startDate)}
              //   onChange={(start) => setEvent({ ...event, startDate: start })}
              readOnly={true}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeSelect
              className="inputTextFields"
              minDate={new Date()}
            />
            <input
              type="text"
              placeholder="Add Event Title"
              value={event?.category}
              readOnly={true}
              //   onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="inputTextFields"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosee}>
            Close
          </Button>
          {/* <Button variant="danger" onClick={() => deleteEvent(event)}>
            Delete
          </Button>
          <Button variant="primary" onClick={() => updateEvent(event)}>
            Save
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShowModal;
