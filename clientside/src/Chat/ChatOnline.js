import React from "react";
import "./chatonline.css";
const ChatOnline = () => {
  return (
    <div className="chatOnline">
      {/* {onlineFriends.map((o) => ( */}
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            //   src={
            //     o?.profilePicture
            //       ? PF + o.profilePicture
            //       : PF + "person/noAvatar.png"
            //   }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">Username</span>
        </div>
        {/* ))} */}
    </div>
  );
};

export default ChatOnline;
