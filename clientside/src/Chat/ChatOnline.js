import axios from "axios";
import { useEffect, useState } from "react";
import "./chatonline.css";
import IconButton from "@material-ui/core/IconButton";
import PhoneIcon from "@material-ui/icons/Phone";
import Button from "@material-ui/core/Button";
import VideoCallIcon from '@material-ui/icons/VideoCall';
export default function ChatOnline({
  onlineUsers,
  currentId,
  setCurrentChat,
  handleChatOnlineClick,
  callUser,
  idToCall,
  callAccepted,
  callEnded,
  leaveCall,
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("http://localhost:5000/emp/");
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    // console.log("USERSS");
    // console.log(onlineUsers);
    // setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f._id)));
    // console.log("setOnlineFriends");
    setOnlineFriends(
      friends?.filter((o1) => onlineUsers?.some((o2) => o1._id == o2.userId))
    );
    // console.log(friends.filter(o1 => onlineUsers.some(o2 => o1._id == o2.userId)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    // when clicked we should get that user socket id so we can call on that socket id
    // JSON.parse(localStorage.getItem("user"))._id
    handleChatOnlineClick(user);
    // console.log(user);
    // try {
    //   const res = await axios.get(
    //     `/conversations/find/${currentId}/${user._id}`
    //   );
    //   setCurrentChat(res.data);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className="chatOnline">
      <h2>Online Users</h2>
      {onlineFriends?.map((o) => (
        <div
          className="chatOnlineFriend"
          onClick={() => callUser != undefined && handleClick(o)}
        >
          {/* {console.log("OnlineFriends Map")} */}
          {/* {console.log(o)} */}
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={o?.profilePicture} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
          {callUser != undefined && (
            <div className="call-button">
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={leaveCall}
                >
                  End Call
                </Button>
              ) : (
                <IconButton
                  color="primary"
                  aria-label="call"
                  onClick={() => callUser(idToCall)}
                >
                  <VideoCallIcon fontSize="large" />
                </IconButton>
              )}
              {/* {idToCall} */}
            </div>
          )}
        </div>
      ))}
      {/* {onlineFriends.length == 0 && (
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">Username</span>
        </div>
      )} */}
    </div>
  );
}
