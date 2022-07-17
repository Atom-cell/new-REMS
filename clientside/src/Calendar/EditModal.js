import React, { useState } from "react";
import "./modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";
const EditModal = ({
  setEditModalOpen,
  event,
  setEvent,
  updateEvent,
  deleteEvent,
}) => {
  // console.log(date);
  // const convertDate = str => {
  //     str = str.toString();
  //     let parts = str.split(" ");
  //     let months = {
  //       Jan: "01",
  //       Feb: "02",
  //       Mar: "03",
  //       Apr: "04",
  //       May: "05",
  //       Jun: "06",
  //       Jul: "07",
  //       Aug: "08",
  //       Sep: "09",
  //       Oct: "10",
  //       Nov: "11",
  //       Dec: "12"
  //     };
  //     return months[parts[1]] + "-" + parts[2] + "-" + parts[3];
  //   };
  return (
    <div className="add-new-event-container">
      <h1>Edit Event</h1>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="titleCloseBtn">
            <button
              onClick={() => {
                setEditModalOpen(false);
              }}
            >
              X
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Add Meet Title"
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

            {/* <input type="text" value={event.endDate} className="inputTextFields"  onChange={(e) => setEvent({ ...event, endDate: e.target.value })}/> */}
            {/* <DatePicker
            format="yyyy-MM-dd"
            selected={event.startDate}
            onChange={(start) => setEvent({ ...event, startDate: start })}
            className="inputTextFields"
          />
          <DatePicker
            format="yyyy-MM-dd"
            selected={event.endDate}
            onChange={(end) => setEvent({ ...event, endDate: end })}
            className="inputTextFields"
          /> */}
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
          <div className="modal-footer">
            <button
              onClick={() => {
                setEditModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button id="cancelBtn" onClick={() => deleteEvent(event)}>
              Delete Event
            </button>
            <button
              onClick={() => {
                //   console.log(event);
                updateEvent(event);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
