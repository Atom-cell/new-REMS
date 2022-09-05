import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./chatboxheader.css";
const ChatBoxHeader = ({ profilePicture, username, handleDeleteChat }) => {
  return (
    <div className="p-3 p-lg-4 user-chat-topbar">
      <Row className="align-items-center">
        <Col sm={4} className="col-8">
          <img
            className="chatProfileImg"
            src={profilePicture}
            alt="No picture"
            style={{ height: "2.4rem", width: "2.4rem" }}
          />
          <span style={{ color: "FFEFD5", fontSize: "18px" }}>{username}</span>
        </Col>
        <Col sm={8} className="col-4">
          <ul className="list-inline user-chat-nav text-end mb-0">
            {/* <li className="list-inline-item">
              <SearchIcon />
            </li> */}
            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <CallIcon />
            </li> */}

            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <VideoCallIcon />
            </li> */}

            <li className="list-inline-item">
              <DeleteOutlineIcon onClick={handleDeleteChat} />
            </li>
          </ul>
        </Col>
      </Row>
      {/* <PinnedAlert onOpenPinnedTab={onOpenPinnedTab} /> */}
      {/* {isOpenAudioModal && (
        <AudioCallModal
          isOpen={isOpenAudioModal}
          onClose={onCloseAudio}
          user={chatUserDetails}
        />
      )} */}
      {/* {isOpenVideoModal && (
        <VideoCallModal
          isOpen={isOpenVideoModal}
          onClose={onCloseVideo}
          user={chatUserDetails}
        />
      )} */}
      {/* {isOpenPinnedTabModal && (
        <AddPinnedTabModal
          isOpen={isOpenPinnedTabModal}
          onClose={onClosePinnedTab}
          pinnedTabs={pinnedTabs}
        />
      )} */}
    </div>
  );
};

export default ChatBoxHeader;
