import React, { useEffect, useState } from "react";
import BoardList from "./BoardList/BoardList";
import Editable from "./Editabled/Editable";
import "./boards.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import SideMenu from "./SideMenu";

const Boards = ({ user }) => {
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
  const [targetBoard, setTargetBoard] = useState();

  useEffect(() => {
    // if (location.state) {
    //   setBoards(location.state.boards);
    //   setCompleteKanban(location.state);
    //   setColor(location.state.color);
    // }
    axios
      .get("/myboards/specificboard", { params: { _id: bid } })
      .then((rec) => {
        // console.log(rec.data);
        setBoards(rec.data[0].boards);
        setCompleteKanban(rec.data[0]);
        setColor(rec.data[0].color);
      })
      .catch((err) => console.log(err));
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
    console.log(title);
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

    // console.log("Source board Index " + s_boardIndex);
    // console.log("Source Card Index " + s_cardIndex);
    // console.log("target board Index " + t_boardIndex);
    // console.log("target card Index " + t_cardIndex);

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
    // console.log(bid);
    // console.log(targetCard);
    setTargetCard({
      bid,
      cid,
    });
  };

  const dragEndedBoard = (board) => {
    // occurs when the user has finished dragging the element
    // console.log("The target baord is:");
    // console.log(targetBoard);
    // console.log("Dragging Board is:");
    // console.log(board);
    // find dragging board index
    let s_boardIndex, t_boardIndex;
    s_boardIndex = boards.findIndex((item) => item._id === board._id);
    if (s_boardIndex < 0) return;

    // find target board index
    t_boardIndex = boards.findIndex((item) => item._id === targetBoard._id);
    if (t_boardIndex < 0) return;

    // now using index swap
    const tempBoards = [...boards];
    tempBoards[s_boardIndex] = tempBoards.splice(
      t_boardIndex,
      1,
      tempBoards[s_boardIndex]
    )[0];
    setBoards(tempBoards);

    setTargetBoard();
  };

  const dragEnteredBoard = (board) => {
    // occurs when the dragged element enters the drop target
    // console.log(board);
    if (targetBoard?._id === board._id) return;
    // console.log(board);
    // setTargetCard({ ...targetCard, bid: board._id });
    setTargetBoard(board);
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

  const updateTitle = (bid, value) => {
    // console.log(value);
    // console.log(location.state);
    setCompleteKanban({ ...completeKanban, title: value });
  };

  const updateBoardTitle = (boardId, value) => {
    const updatedBoards = boards.map((b) => {
      if (b._id == boardId) {
        return { ...b, title: value };
      }
      return b;
    });
    setBoards(updatedBoards);
  };

  useEffect(() => {
    // localStorage.setItem("prac-kanban", JSON.stringify(boards));
    // console.log(boards);
    if (boards?.length > 0) {
      // update using current params id
      // console.log(boards);
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
      className="boards-container"
      style={{
        backgroundColor: color,
        backgroundImage: `url(${color})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="boards-container-nav"
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
        <div className="boards-container-nav-background-button-div">
          <Button
            className="app_nav_background_button submitbtn"
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
      <div className="app_boards_container custom-scroll-horizontal">
        <div className="app_boards">
          {boards?.map((item) => (
            <BoardList
              key={item._id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item._id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
              dragEnteredBoard={dragEnteredBoard}
              dragEndedBoard={dragEndedBoard}
              updateBoardTitle={updateBoardTitle}
            />
          ))}
          <div className="app_boards_last">
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter List Name"
              text="Add Another List"
              buttonText="Add List"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boards;
