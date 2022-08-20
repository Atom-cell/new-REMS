import React, { useEffect, useState } from "react";
import Board from "./Board/Board";
import Editable from "./Editabled/Editable";
import "./boards.css";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-ui/core";
import Drawer from "@mui/material/Drawer";
import { AppBar, MenuItem } from "@mui/material";
import SideMenu from "./SideMenu";

const Boards = ({ user }) => {
  const location = useLocation();
  // console.log(location.state.boards);
  // console.log(location.state);
  const { bid } = useParams();
  const [boards, setBoards] = useState();
  const [openSideNav, setOpenSideNav] = useState(false);
  const [color, setColor] = useState("");
  const [completeKanban, setCompleteKanban] = useState();
  // JSON.parse(localStorage.getItem("prac-kanban")) || []

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  useEffect(() => {
    if (location.state) {
      setBoards(location.state.boards);
      setCompleteKanban(location.state);
      setColor(location.state.color);
    }
  }, []);

  const addboardHandler = (name) => {
    // console.log(location.state);
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item._id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const addCardHandler = (id, title) => {
    const index = boards.findIndex((item) => item._id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      _id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
    });
    setBoards(tempBoards);
  };

  const removeCard = (bid, cid) => {
    console.log(bid);
    console.log(cid);
    const index = boards.findIndex((item) => item._id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item._id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item._id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item._id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item._id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item._id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    // console.log(bid);
    // console.log(cid);
    // console.log(boards);
    const index = boards.findIndex((item) => item._id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;
    // console.log(cards);

    const cardIndex = cards.findIndex((item) => item._id === cid);
    // console.log(cardIndex);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;
    // console.log(tempBoards);

    setBoards(tempBoards);
  };

  const updateTitle = (value) => {
    // console.log(value);
    // console.log(location.state);
    setCompleteKanban({ ...completeKanban, title: value });
  };

  useEffect(() => {
    // localStorage.setItem("prac-kanban", JSON.stringify(boards));
    // console.log(boards);
    if (boards?.length > 0) {
      // update using current params id
      console.log(boards);
      // console.log(bid);
      axios
        .put("/myboards/updateboard", {
          bid: bid,
          uid: user._id,
          boards: boards,
        })
        // .then((rec) => console.log(rec.data))
        .catch((err) => console.log(err));
    }
  }, [boards]);

  useEffect(() => {
    // localStorage.setItem("prac-kanban", JSON.stringify(boards));
    if (boards?.length > 0) {
      // console.log(boards);
      axios
        .put("/myboards/updateboard", {
          bid: bid,
          uid: user._id,
          title: completeKanban.title,
          boards: boards,
        })
        // .then((rec) => console.log(rec.data))
        .catch((err) => console.log(err));
    }
  }, [completeKanban]);

  return (
    <div
      className="app"
      style={{
        backgroundColor: color,
        backgroundImage: `url(${color})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="app_nav"
        style={{
          backgroundColor: color,
          backgroundImage: `url(${color})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Editable
          displayClass="app_boards_title"
          editClass="board-add-card-edit-title"
          defaultValue={completeKanban?.title}
          text={completeKanban?.title}
          placeholder="Enter Title"
          onSubmit={updateTitle}
        />
        <div className="app_nav_background_button_div">
          <Button
            variant="contained"
            color="secondary"
            className="app_nav_background_button"
            onClick={() => setOpenSideNav(true)}
          >
            Change Background
          </Button>
        </div>
      </div>
      {openSideNav && (
        <SideMenu
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
          setColor={setColor}
        />
      )}
      <div className="app_boards_container">
        <div className="app_boards">
          {boards?.map((item) => (
            <Board
              key={item._id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item._id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
            />
          ))}
          <div className="app_boards_last">
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boards;
