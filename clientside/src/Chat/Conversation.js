import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversation.css";
const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // get id having conversation with the current user
    const friendId = conversation.members.find((m) => m != currentUser);
    const getUser = async () => {
      try {
        // get user information using id
        const res = await axios(`http://localhost:5000/myEmployee/${friendId}`);
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
        src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"
        // src={
        //   user?.profilePicture
        //     ? PF + user.profilePicture
        //     : PF + "person/noAvatar.png"
        // }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
};

export default Conversation;
