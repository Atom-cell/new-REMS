import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./allcomments.css";
import SingleComment from "./SingleComment";
const AllComments = () => {
  const location = useLocation();
  const [allComments, setAllComments] = useState([
    // { projectId: 1, employeeName: "Naseer", text: "Hello" },
    // { projectId: 2, employeeName: "Lewis", text: "Hello" },
    // { projectId: 3, employeeName: "Ahsan", text: "yo" },
    // { projectId: 4, employeeName: "Sibtain", text: "whatsup" },
    // { projectId: 5, employeeName: "Naseer", text: "Hello" },
  ]);
  const [myProject, setMyProject] = useState(location.state.project);
  const [comment, setComment] = useState();

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete the comment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("/myComments/deleteComment", {
                data: { _id: id },
              })
              .then((rec) => {
                toast.success("Comment Deleted");
                fetchData();
              })
              .catch((err) => console.log(err));
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const addComment = () => {
    if (comment) {
      const user = JSON.parse(localStorage.getItem("user"));
      //   console.log(comment);
      //   console.log(myProject);
      //   console.log(user);
      axios
        .post("/myComments/createcomment", {
          projectId: myProject?._id,
          employeeId: user?._id,
          text: comment,
        })
        .then((rec) => {
          console.log(rec.data);
          toast.success("Comment Added");
          setComment("");
          fetchData();
        })
        .catch((err) => console.log(err + "AllComments line 34"));
    } else {
      toast.error("Please Enter Comment");
    }
  };

  const fetchData = async () => {
    axios
      .get("/myComments/getallcomments", {
        params: {
          projectId: myProject?._id,
        },
      })
      .then((rec) => {
        console.log(rec.data);
        setAllComments(rec.data);
      })
      .catch((err) => console.log(err + "AllComments line 54"));
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);

  return (
    <div className="main-container-all-comments">
      <div className="main-container">
        <h1 className="main-heading">{myProject?.projectName} Comments</h1>
        <div className="inner-holder">
          <div className="element-holder">
            <p className="para1">
              Post your queries/comments here for project{" "}
              {myProject?.projectName}
            </p>
            <div className="element-holder">
              <textarea
                className="comment-field"
                placeholder="Your Comment"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <Button variant="primary" onClick={addComment}>
                Add Comment
              </Button>
              {/* <button type="submit" className="btn">
              Add Comment
            </button> */}
            </div>
          </div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/comments-app/comments-img.png"
            className="image1"
            alt="comments"
          />
        </div>
        <hr className="hr-all-comments" />
        <p className="comments-count">
          <span className="number-count">{allComments?.length}</span> Comments
          <ul className="comment-holder">
            {allComments.map((eachObject) => (
              <SingleComment
                key={eachObject._id}
                arrayList={eachObject}
                handleDelete={handleDelete}
                //   deleteComment={this.deleteComment}
                //   toggleFavorite={this.toggleFavorite}
              />
            ))}
          </ul>
        </p>
      </div>
    </div>
  );
};

export default AllComments;
