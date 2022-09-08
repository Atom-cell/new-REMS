import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./chatboxheader.css";
const ChatBoxHeader = ({ friend, handleDeleteChat }) => {
  // const [isOpenVideoModal, setIsOpenVideoModal] = useState(false);

  // const handleClose = () => setIsOpenVideoModal(false);
  // const handleShow = () => setIsOpenVideoModal(true);
  return (
    <div className="p-3 p-lg-4 user-chat-topbar">
      <Row className="align-items-center">
        <Col sm={4} className="col-8">
          <img
            className="chatProfileImg"
            src={friend?.profilePicture}
            alt="No picture"
            style={{ height: "2.4rem", width: "2.4rem" }}
          />
          <span style={{ color: "FFEFD5", fontSize: "18px" }}>
            {friend?.username}
          </span>
        </Col>
        <Col sm={8} className="col-4">
          <ul className="list-inline user-chat-nav text-end mb-0">
            {/* <li className="list-inline-item">
              <SearchIcon />
            </li> */}
            {/* <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
              <CallIcon />
            </li> */}

            {/* <li
              className="list-inline-item d-none d-lg-inline-block me-2 ms-0"
              onClick={handleShow}
            >
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
          handleClose={handleClose}
          friend={friend}
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
