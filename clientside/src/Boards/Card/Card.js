import React, { useEffect, useState } from "react";
import { CheckSquare, Clock, Trash, UserPlus } from "react-feather";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";
import AssignTaskModal from "./AssignTaskModal";
import Image from "react-bootstrap/Image";
import axios from "axios";

function Card(props) {
  const [showModal, setShowModal] = useState(false);
  const [assignedToUser, setAssignedToUser] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { _id, title, date, tasks, labels, assignedTo } = props.card;

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (!date) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Aprl",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    return day + " " + month;
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {JSON.parse(localStorage.getItem("user")).role !== "Employee" ? (
        <>
          {assignedTo
            ? `Update Assignee ${assignedToUser?.username}`
            : "Assign Task"}
        </>
      ) : (
        <>{assignedTo ? `${assignedToUser?.username}` : "Not assigned yet"}</>
      )}
    </Tooltip>
  );

  useEffect(() => {
    if (assignedTo) {
      axios
        .get("/emp/getemployeeinformation", { params: { _id: assignedTo } })
        .then((rec) => setAssignedToUser(rec.data[0]))
        .catch((err) => console.log(err + "Card 54"));
    }
  });

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
          hideAssign={props.hideAssign}
        />
      )}
      <div
        className="card"
        draggable
        onDragEnd={(e) => {
          e.stopPropagation();
          props.dragEnded(props.boardId, _id);
        }}
        onDragEnter={(e) => {
          e.stopPropagation();
          props.dragEntered(props.boardId, _id);
        }}
        onClick={() => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user?.role === "admin" || user?._id === assignedTo) {
            setShowModal(true);
          }
        }}
      >
        <div className="card_top">
          <div className="card_top_labels">
            {labels?.map((item, index) => (
              <label key={index} style={{ backgroundColor: item.color }}>
                {item.text}
              </label>
            ))}
          </div>
          <div
            className="card_top_more"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Trash
              className="trash"
              onClick={() => props.removeCard(props.boardId, _id)}
            />
          </div>
        </div>
        <div className="card_title">{title}</div>
        <div className="card_footer">
          {props.hideAssign === true ? (
            <div>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250 }}
                overlay={renderTooltip}
              >
                <div
                // onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                >
                  {assignedToUser ? (
                    <Image
                      src={
                        assignedToUser?.profilePicture
                          ? `data:image/jpeg;base64,${assignedToUser?.profilePicture}`
                          : "https://i.stack.imgur.com/34AD2.jpg"
                      }
                      roundedCircle
                      style={{ height: "30px", width: "30px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          JSON.parse(localStorage.getItem("user")).role !==
                          "Employee"
                        )
                          handleShow();
                      }}
                    />
                  ) : (
                    <UserPlus
                      className="trash"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          JSON.parse(localStorage.getItem("user")).role !==
                          "Employee"
                        )
                          handleShow();
                      }}
                    />
                  )}
                </div>
              </OverlayTrigger>
            </div>
          ) : null}
          {date && (
            <p className="card_footer_item">
              <Clock className="card_footer_icon" />
              {formatDate(date)}
            </p>
          )}
          {tasks && tasks?.length > 0 && (
            <p className="card_footer_item">
              <CheckSquare className="card_footer_icon" />
              {tasks?.filter((item) => item.completed)?.length}/{tasks?.length}
            </p>
          )}
        </div>
        <AssignTaskModal
          show={show}
          handleClose={handleClose}
          setShowModal={setShowModal}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      </div>
    </>
  );
}

export default Card;
