import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import "./modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEventModal = ({
  newEvent,
  setNewEvent,
  addNewEvent,
  modalOpen,
  handleClose,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const handleSelectedChange = (e) => {
    setNewEvent({ ...newEvent, category: e.target.value });
    // console.log(event.target.value);
  };
  return (
    <div className="add-new-event-container">
      <Modal show={modalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              type="text"
              placeholder="Add Meet Title"
              value={newEvent?.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="inputTextFields"
            />
            <DatePicker
              placeholderText="Start Date & Time"
              selected={newEvent?.start}
              onChange={(start) => setNewEvent({ ...newEvent, start: start })}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm"
              showTimeSelect
              className="inputTextFields"
              minDate={new Date()}
            />
            <div className="inputTextFields selectContainerModal">
              <select
                id="framework"
                value={newEvent?.category}
                onChange={handleSelectedChange}
              >
                <option value="" selected="selected">
                  Select Event Category
                </option>
                <option value="Goal">Goal</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => addNewEvent(newEvent)}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEventModal;
