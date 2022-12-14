import React, { useState } from "react";
import { Trash } from "react-feather";

import Card from "../Card/Card";
import Editable from "../Editabled/Editable";

import "./BoardList.css";

function BoardList(props) {
  const updateTitle = (value) => {
    props.updateBoardTitle(props.board._id, value);
  };
  return (
    <div
      className="board"
      draggable
      onDragEnd={(e) => props.dragEndedBoard(props.board)}
      onDragEnter={(e) => props.dragEnteredBoard(props.board)}
    >
      <div className="board_header">
        <p className="board_header_title">
          {/* {props.board?.title} */}
          <Editable
            displayClass="app_boards_title"
            editClass="board-list-edit-title"
            defaultValue={props.board?.title}
            text={props.board?.title}
            placeholder="Enter List Title"
            type={"text"}
            onSubmit={updateTitle}
          />
          <span>{props.board?.cards?.length || 0}</span>
        </p>
        <div className="board_header_title_more">
          <Trash className="trash" onClick={() => props.removeBoard()} />
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {props.board?.cards?.map((item) => (
          <Card
            key={item._id}
            card={item}
            boardId={props.board._id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
            hideAssign={props.hideAssign}
          />
        ))}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          type={"text"}
          onSubmit={(value) => props.addCard(props.board?._id, value)}
        />
      </div>
    </div>
  );
}

export default BoardList;
