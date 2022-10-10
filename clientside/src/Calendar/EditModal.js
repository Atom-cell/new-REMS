import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const EditModal = ({
  event,
  setEvent,
  updateEvent,
  deleteEvent,
  editModalOpen,
  handleClosee,
}) => {
  return (
    <div className="add-new-event-container">
      <Modal show={editModalOpen} onHide={handleClosee}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              type="text"
              placeholder="Add Event Title"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="inputTextFields"
            />
            {/* <input type="text" value={event.startDate} className="inputTextFields" onChange={(e) => setEvent({ ...event, startDate: e.target.value })}/> */}

            <DatePicker
              placeholderText="Start Date"
              selected={new Date(event.startDate)}
              onChange={(start) => setEvent({ ...event, startDate: start })}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeSelect
              className="inputTextFields"
              minDate={new Date()}
            />
            <div className="inputTextFields selectContainerModal">
              {/* <label for="framework">Select Event Category</label> */}
              <select
                id="framework"
                value={event.category}
                onChange={(e) =>
                  setEvent({ ...event, category: e.target.value })
                }
              >
                <option value="Goal" selected="selected">
                  Goal
                </option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosee}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deleteEvent(event)}>
            Delete
          </Button>
          <Button variant="primary" onClick={() => updateEvent(event)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditModal;
