import React, { useState } from "react";
import "./modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Modal = ({ setModalOpen, newEvent, setNewEvent, addNewEvent }) => {
  const [startDate, setStartDate] = useState(new Date());
  const handleSelectedChange = (e) => {
    setNewEvent({ ...newEvent, category: e.target.value });
    // console.log(event.target.value);
  };
  return (
    <div className="add-new-event-container">
      <h1>Add New Event</h1>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="titleCloseBtn">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
            >
              X
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Add Meet Title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="inputTextFields"
            />
            <DatePicker
              placeholderText="Start Date & Time"
              selected={newEvent.start}
              onChange={(start) => setNewEvent({ ...newEvent, start: start })}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm"
              showTimeSelect
              className="inputTextFields"
              minDate={new Date()}
            />
            <div className="inputTextFields selectContainerModal">
              {/* <label>Select Event Category</label> */}
              <select
                id="framework"
                value={newEvent.category}
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
          <div className="modal-footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={() => addNewEvent(newEvent)}>Add Event</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
