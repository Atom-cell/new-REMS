import React, { useState } from "react";

import { X } from "react-feather";

import "./Editable.css";

function Editable(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [inputText, setInputText] = useState(props.defaultValue || "");

  const submission = (e) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      props.onSubmit(inputText);
      setInputText("");
    }
    setIsEditable(false);
  };

  return (
    <div className="editable">
      {isEditable ? (
        <form
          className={`editable_edit ${props.editClass ? props.editClass : ""}`}
          onSubmit={submission}
        >
          {props.type === "textarea" ? (
            <textarea
              name=""
              id=""
              cols="70"
              rows="3"
              placeholder={props.placeholder || props.text}
              onChange={(event) => setInputText(event.target.value)}
              autoFocus
            ></textarea>
          ) : (
            <input
              type={props.type}
              value={inputText}
              placeholder={props.placeholder || props.text}
              onChange={(event) => setInputText(event.target.value)}
              autoFocus
              min={
                props.type === "date"
                  ? new Date().toISOString().split("T")[0]
                  : ""
              }
            />
          )}
          <div className="editable_edit_footer">
            <button type="submit">{props.buttonText || "Add"}</button>
            <X onClick={() => setIsEditable(false)} className="closeIcon" />
          </div>
        </form>
      ) : (
        <p
          className={`editable_display ${
            props.displayClass ? props.displayClass : ""
          }`}
          onClick={() => {
            if (props.emp !== true) setIsEditable(true);
          }}
        >
          {props.text ? props.text : props.placeholder}
        </p>
      )}
    </div>
  );
}

export default Editable;
