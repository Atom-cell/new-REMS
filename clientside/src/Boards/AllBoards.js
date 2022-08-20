import { Button } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../Projects//ProjectCard";
import Form from "react-bootstrap/Form";
import { Trash } from "react-feather";
import { toast } from "react-toastify";
import axios from "axios";

// const allBoards = [
//   {
//     _id: 1,
//     title: "ABC",
//     cards: [
//       {
//         _id: 11,
//         title: "A",
//         tasks: [],
//         labels: [
//           {
//             text: "Frontend",
//             color: "red",
//           },
//         ],
//         desc: "Just Checking",
//         date: "02-02-2022",
//       },
//     ],
//   },
//   {
//     _id: 2,
//     title: "DEF",
//     cards: [
//       {
//         _id: 22,
//         title: "A",
//         tasks: [],
//         labels: [
//           {
//             text: "Backend",
//             color: "blue",
//           },
//         ],
//         desc: "Just Checking Again",
//         date: "02-02-2022",
//       },
//     ],
//   },
// ];

const AllBoards = ({ user }) => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState();

  const [searchInput, setSearchInput] = useState();

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);

    axios
      .get(`/myboards/${e.target.value}`)
      .then((records) => {
        console.log(records.data);
        setBoards(records.data);
      })
      .catch((err) => console.log(err));
  };

  const handleCreateBoard = () => {
    // console.log(user);
    axios
      .post("/myboards/createboard", { userId: user._id })
      .then((rec) => {
        console.log(rec.data);
        navigate(`/boards/${rec.data._id}`, { state: rec.data });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteBoard = (board) => {
    const confirmBox = window.confirm(
      "Are you sure you want to delete this Board?"
    );
    if (confirmBox) {
      axios
        .delete("/myboards/deleteboard", {
          data: { _id: board._id },
        })
        .then((rec) => {
          //   console.log(rec.data);
          const newBoards = boards.filter(
            (newBoard) => newBoard._id != rec.data._id
          );
          setBoards(newBoards);
          toast.info(`${rec.data.title} is Deleted`);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/myBoards");
      //   console.log(res.data);
      setBoards(res.data);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <div className="projectContainer">
      <div className="project-header">
        <div className="search-container">
          <Form.Control
            type="search"
            placeholder="Search Kanban Board"
            className="me-2"
            aria-label="Search"
            value={searchInput}
            onChange={handleSearchChange}
            style={{ boxShadow: "#da0d50 !important" }}
          />
        </div>
        <div className="create-project">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateBoard}
          >
            Create Board
          </Button>
        </div>
      </div>
      <div className="allProjects">
        {boards?.map((board, index) => {
          return (
            <>
              <div className="project-column" key={index}>
                <div
                  style={{
                    float: "right",
                    marginRight: "25px",
                    marginTop: "10px",
                  }}
                >
                  <Trash
                    className="trash"
                    onClick={() => handleDeleteBoard(board)}
                  />
                </div>
                <div
                  className="featuredItem"
                  onClick={() => {
                    // const filterBoards = boards.filter((b) => b._id == board._id);
                    navigate(`/boards/${board._id}`, { state: board });
                  }}
                >
                  <span className="featuredTitle">{board.title}</span>
                  <div className="assigned-by">
                    <span className="featuredSub">Total Cards: </span>
                    <span className="featuredTitle">{board.cards?.length}</span>
                  </div>
                  <div className="assigned-to">
                    <span className="featuredSub">Related To: </span>
                    <span className="featuredTitle">Project Name</span>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default AllBoards;
