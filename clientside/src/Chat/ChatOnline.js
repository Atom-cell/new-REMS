import axios from "axios";
import { useEffect, useState } from "react";
import "./chatonline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
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
    console.log("USERSS");
    console.log(onlineUsers);
    // setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f._id)));
    console.log("setOnlineFriends");
    setOnlineFriends(friends.filter(o1 => onlineUsers.some(o2 => o1._id == o2.userId)));
    // console.log(friends.filter(o1 => onlineUsers.some(o2 => o1._id == o2.userId)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
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
      {onlineFriends?.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          {console.log("OnlineFriends Map")}
          {console.log(o)}
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={o?.profilePicture} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
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
