import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

import "./CardInfo.css";

function CardInfo(props) {
  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

  const [selectedColor, setSelectedColor] = useState();
  const [values, setValues] = useState({
    ...props.card,
  });

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const updateDesc = (value) => {
    setValues({ ...values, desc: value });
  };

  const addLabel = (label) => {
    const index = values.labels.findIndex((item) => item.text === label.text);
    if (index > -1) return;

    setSelectedColor("");
    setValues({
      ...values,
      labels: [...values.labels, label],
    });
  };

  const removeLabel = (label) => {
    const tempLabels = values.labels.filter((item) => item.text !== label.text);

    setValues({
      ...values,
      labels: tempLabels,
    });
  };

  const addTask = (value) => {
    const task = {
      task: value,
      completed: false,
    };
    setValues({
      ...values,
      tasks: [...values.tasks, task],
    });
  };

  const removeTask = (id) => {
    const tasks = [...values.tasks];

    const tempTasks = tasks.filter((item) => item._id !== id);
    setValues({
      ...values,
      tasks: tempTasks,
    });
  };

  const updateTask = (id, value) => {
    const tasks = [...values.tasks];

    const index = tasks.findIndex((item) => item._id === id);
    if (index < 0) return;

    tasks[index].completed = value;

    setValues({
      ...values,
      tasks,
    });
  };

  const calculatePercent = () => {
    if (!values.tasks?.length) return 0;
    const completed = values.tasks?.filter((item) => item.completed)?.length;
    return (completed / values.tasks?.length) * 100;
  };

  const updateDate = (date) => {
    if (!date) return;

    setValues({
      ...values,
      date,
    });
  };

  useEffect(() => {
    if (props.updateCard) {
      // console.log(props.boardId);
      // console.log(values._id);
      // console.log(values);
      props.updateCard(props.boardId, values._id, values);
    }
  }, [values]);
  return (
    <Modal onClose={props.onClose}>
      <div className="cardinfo">
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            <p style={{ marginTop: "20px" }}>Title</p>
          </div>
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"
            type={"text"}
            onSubmit={updateTitle}
          />
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            <p style={{ marginTop: "20px" }}>Description</p>
          </div>
          <Editable
            defaultValue={values.desc}
            text={values.desc || "Add a Description"}
            placeholder="Enter description"
            type={"text"}
            onSubmit={updateDesc}
          />
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            <p style={{ marginTop: "20px" }}>Date</p>
          </div>
          <input
            type="date"
            defaultValue={values.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
            readOnly={
              JSON.parse(localStorage.getItem("user"))?.role === "admin"
                ? false
                : true
            }
          />
        </div>
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Tag />
            <p>Labels</p>
          </div>
          <div className="cardinfo_box_labels">
            {values.labels?.map((item, index) => (
              <label
                key={index}
                style={{ backgroundColor: item.color, color: "#fff" }}
              >
                {item.text}
                <X onClick={() => removeLabel(item)} />
              </label>
            ))}
          </div>
          <ul>
            {colors.map((item, index) => (
              <li
                key={index + item}
                style={{ backgroundColor: item }}
                className={selectedColor === item ? "li_active" : ""}
                onClick={() => setSelectedColor(item)}
              />
            ))}
          </ul>
          <Editable
            text="Add Label"
            placeholder="Enter label text"
            type={"text"}
            onSubmit={(value) =>
              addLabel({ color: selectedColor, text: value })
            }
          />
        </div>
        {/* {props.hideAssign !== true && ( */}
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            <p style={{ marginTop: "20px" }}>Tasks</p>
          </div>
          <div className="cardinfo_box_progress-bar">
            <div
              className="cardinfo_box_progress"
              style={{
                width: `${calculatePercent()}%`,
                backgroundColor: calculatePercent() === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <div className="cardinfo_box_task_list">
            {values?.tasks?.map((item) => (
              <div key={item._id} className="cardinfo_box_task_checkbox">
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  onChange={(event) =>
                    updateTask(item._id, event.target.checked)
                  }
                />
                <p className={item.completed ? "completed" : ""}>{item.task}</p>
                {JSON.parse(localStorage.getItem("user"))?.role === "admin" && (
                  <Trash onClick={() => removeTask(item._id)} />
                )}
              </div>
            ))}
          </div>
          {JSON.parse(localStorage.getItem("user"))?.role === "admin" && (
            <Editable
              text={"Add a Task"}
              placeholder="Enter task"
              type={"text"}
              onSubmit={addTask}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
