import axios from "axios";
import { useEffect, useState } from "react";
import "./chatonline.css";
import VideoCallIcon from "@material-ui/icons/VideoCall";
export default function ChatOnline({
  onlineUsers,
  currentId,
  callUser,
  callAccepted,
  callEnded,
  newConversation,
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      if (localStorage.getItem("role") === "Employee") {
        const res = await axios.get(
          "http://localhost:5000/emp/getcompanyemployees",
          { params: { _id: JSON.parse(localStorage.getItem("user"))._id } }
        );
        const response = await axios.get(
          "http://localhost:5000/emp/getmyadmin",
          {
            params: { _id: JSON.parse(localStorage.getItem("user"))._id },
          }
        );
        setFriends([...res.data, response.data[0]]);
      } else {
        const res = await axios.get(
          "http://localhost:5000/emp/getmyemployees",
          {
            params: { _id: JSON.parse(localStorage.getItem("user"))._id },
          }
        );
        setFriends(res.data);
      }
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(
      friends?.filter((o1) => onlineUsers?.some((o2) => o1._id === o2.userId))
    );
    // console.log(friends.filter(o1 => onlineUsers.some(o2 => o1._id == o2.userId)));
  }, [friends, onlineUsers]);

  const handleClick = (user) => {
    callUser(user);
  };

  return (
    <div className={callAccepted != undefined && "chatOnlineVideoCall"}>
      <h2>Online</h2>
      {onlineFriends?.map((o) => (
        <div
          className="chatOnlineFriend"
          onClick={() => newConversation != undefined && newConversation(o._id)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={`data:image/jpeg;base64,${o?.profilePicture}`}
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
          {callUser !== undefined && (
            <>
              {callAccepted && !callEnded ? null : (
                <div
                  className="mx-3 video-call-icon-chat-online"
                  onClick={() => handleClick(o)}
                >
                  <VideoCallIcon />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
