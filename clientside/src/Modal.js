import React from "react";
import "./modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const Modal = ({ setModalOpen, newEvent, setNewEvent, addNewEvent }) => {
  const handleSelectedChange = (e) => {
    setNewEvent({ ...newEvent, category: e.target.value });
    // console.log(event.target.value);
  };
  return (
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
            placeholderText="Start Date"
            selected={newEvent.start}
            onChange={(start) => setNewEvent({ ...newEvent, start: start })}
            className="inputTextFields"
          />
          <DatePicker
            placeholderText="End Date"
            selected={newEvent.end}
            onChange={(end) => setNewEvent({ ...newEvent, end })}
            className="inputTextFields"
          />
          <div className="selectContainer">
            <label>Select Event Category</label>
            <select
              id="framework"
              value={newEvent.category}
              onChange={handleSelectedChange}
            >
              <option value="Goal" selected="selected">
                Goal
              </option>
              <option value="Reminder">Reminder</option>
            </select>
          </div>
        </div>
        <div className="footer">
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
  );
};

export default Modal;
