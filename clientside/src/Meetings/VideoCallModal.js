import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./videocallmodal.css";

const VideoCallModal = ({ isOpen, handleClose, friend, cutCallInBetween }) => {
  return (
    <Modal
      show={isOpen}
      // onHide={handleClose}
      // tabIndex={-1}
      centered
      className="videocallModal"
      contentClassName="shadow-lg border-0"
    >
      <Modal.Body className="p-0">
        <img
          src={
            friend && friend.profilePicture
              ? friend.profilePicture
              : "imagePlaceholder"
          }
          alt=""
          className="videocallModal-bg"
        />
        <div className="position-absolute start-0 end-0 bottom-0">
          <div className="text-center">
            <div className="d-flex justify-content-center align-items-center text-center">
              {/* <div className="avatar-md h-auto">
                <Button
                  color="light"
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  <span className="avatar-title bg-transparent text-muted font-size-20">
                    <i className="fa fa-microphone-slash"></i>
                  </span>
                </Button>
              </div> */}
              {/* <div className="avatar-md h-auto">
                <Button
                  color="light"
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  <span className="avatar-title bg-transparent text-muted font-size-20">
                    <i className="bx bx-volume-full"></i>
                  </span>
                </Button>
              </div> */}
              {/* <div className="avatar-md h-auto">
                <Button
                  color="light"
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  <span className="avatar-title bg-transparent text-muted font-size-20">
                    <i className="fas fa-video"></i>
                  </span>
                </Button>
              </div> */}
              {/* <div className="avatar-md h-auto">
                <Button
                  color="light"
                  type="button"
                  className="avatar-sm rounded-circle"
                >
                  <span className="avatar-title bg-transparent text-muted font-size-20">
                    <i className="bx bx-refresh"></i>
                  </span>
                </Button>
              </div> */}
            </div>

            <div className="mt-4 call-end">
              <Button
                color="danger"
                type="button"
                className="avatar-md call-close-btn rounded-circle bg-danger"
                onClick={handleClose}
              >
                <span
                  className="avatar-title bg-transparent font-size-24"
                  onClick={() => cutCallInBetween(friend._id)}
                >
                  <i
                    className="fa-solid fa-phone call-end-icon"
                    style={{ transform: "rotate(135deg)" }}
                  ></i>
                </span>
              </Button>
            </div>
          </div>

          <div className="p-4 mt-n4 modal-below-image">
            <div className="text-white mt-4 text-center">
              <h5 className="font-size-18 text-truncate mb-0 text-white">
                {friend ? `${friend.username}` : ""}
              </h5>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VideoCallModal;
