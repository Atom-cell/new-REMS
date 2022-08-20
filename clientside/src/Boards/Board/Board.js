import React, { useState } from "react";
import { Trash } from "react-feather";

import Card from "../Card/Card";
import Editable from "../Editabled/Editable";

import "./Board.css";

function Board(props) {
  return (
    <div className="board">
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title}
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
          />
        ))}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?._id, value)}
        />
      </div>
    </div>
  );
}

export default Board;
