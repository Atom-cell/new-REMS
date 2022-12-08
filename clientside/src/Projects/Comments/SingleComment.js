import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { Trash } from "react-feather";
import { format } from "timeago.js";
import "./singlecomment.css";
const SingleComment = ({ arrayList, handleDelete }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    // console.log(arrayList.employeeId);
    if (arrayList?.employeeId === null) {
      // get admin data
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        setUser(user);
      } else {
        axios
          .get("/emp/getmyadmin", { params: { _id: user?._id } })
          .then((rec) => {
            console.log(rec.data);
            setUser(rec.data[0]);
          })
          .catch((err) => console.log(err + "AllComments line 34"));
      }
    }
  }, []);

  return (
    <div>
      <li className="comment-item" key={arrayList?._id}>
        <div className="content-holder">
          {/* <p className={`user-icon`}>
            {arrayList?.employeeId?.username
              ? arrayList?.employeeId?.username
              : user?.username}
          </p> */}
          <img
            className="chatProfileImg"
            src={
              arrayList?.employeeId
                ? `data:image/jpeg;base64,${arrayList?.employeeId?.profilePicture}`
                : `data:image/jpeg;base64,${user?.profilePicture}`
            }
            //     : "https://i.stack.imgur.com/34AD2.jpg"
            // alt="No picture"
            style={{ height: "2.4rem", width: "2.4rem" }}
          />
          <div className="sub-holder">
            <div className="name-holder">
              <h1 className="username">
                {arrayList?.employeeId?.username
                  ? arrayList?.employeeId?.username
                  : user?.username}
              </h1>
              <p className="time-now">{format(arrayList?.createdAt)}</p>
            </div>
            <p className="comment-line">
              {arrayList?.text}
              {(JSON.parse(localStorage.getItem("user"))?.role === "admin" ||
                JSON.parse(localStorage.getItem("user"))?._id ===
                  arrayList?.employeeId?._id) && (
                <Trash
                  className="del-btn"
                  onClick={() => handleDelete(arrayList?._id)}
                />
              )}
            </p>
          </div>
        </div>
        {/* <div className="icons-holder">
          <Trash className="del-btn" />
        </div> */}
        <hr />
      </li>
    </div>
  );
};

export default SingleComment;
