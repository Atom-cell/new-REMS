import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversation.css";
const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // get id having conversation with the current user
    const friendId = conversation.members.find((m) => m != currentUser._id);
    const getUser = async () => {
      try {
        // get user information using id
        const res = await axios(`http://localhost:5000/emp/${friendId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={user?.profilePicture}
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
};

export default Conversation;
