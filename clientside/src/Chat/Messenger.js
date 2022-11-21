import React, { useState, useEffect, useRef } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SendIcon from "@mui/icons-material/Send";
import Alert from "react-bootstrap/Alert";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import ChatOnline from "./ChatOnline";
import Conversation from "./Conversation";
import Message from "./Message";
import ChatMenu from "./ChatMenu";
import ChatBoxHeader from "./ChatBoxHeader";
import FileUpload from "./FileUpload";
import "./messenger.css";
import axios from "axios";
import { toast } from "react-toastify";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8900");

const Messenger = ({ onlineUsers, setOnlineUsers, arrivalMessage, user }) => {
  const [newMessage, setNewMessage] = useState();
  const [conversations, setConversations] = useState();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const scrollRef = useRef();
  const [showOnlineUsers, setShowOnlineUsers] = useState(true);
  const [friend, setFriend] = useState();
  const [notOnlineEmployees, setNotOnlineEmployees] = useState([]);

  const [file, setFile] = useState();

  const getFiles = (files) => {
    setFile(files);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {showOnlineUsers ? "Hide Online Users" : "Show Online Users"}
    </Tooltip>
  );

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (user) {
  //     // console.log(user);
  //     setUser(user);
  //   }
  // }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // useEffect(() => {
  //   socket.emit("addUser", user?._id);
  //   socket.on("getUsers", (users) => {
  //     setOnlineUsers(users);
  //     // setOnlineUsers(
  //     //   user.followings.filter((f) => users.some((u) => u.userId === f))
  //     // );
  //   });
  // }, [user]);

  // fetch all messages of the current user
  useEffect(() => {
    getConversations();
  }, [user._id]);

  const getConversations = async () => {
    // get all conversation of a specific user i-e the one that is logged in Naseer
    // naseer employee id is : 6262243469482d6b557e3b59
    // console.log(user._id);
    try {
      const res = await axios.get(
        `http://localhost:5000/myConversation/${user._id}`
      );
      // console.log(res.data);
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Get Messages for specific convo
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/myMessages/" + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // fire this use Effect whenever messages changes
  // this useffect is to adjust the messages view to bottom whenever new message is sent
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    // e.preventDefault();
    // sender is the person that is currently logged in i-e Naseer
    var imageUrl = "";
    // const type = files.base64.split(";")[0].split(":")[1];
    // console.log(type);
    // if (
    //   type.includes("image") ||
    //   type.includes("video") ||
    //   type.includes("pdf")
    // ) {
    //   setCheck(files.base64);
    // } else {
    //   toast.info("you can only send image or pdf or video");
    // }
    var message = {};
    // console.log(currentChat);
    if (file) {
      message = {
        sender: user?._id,
        text: newMessage,
        conversationId: currentChat._id,
        Image: {
          name: file.name,
          image: file.base64,
        },
      };
    } else {
      message = {
        sender: user?._id,
        text: newMessage,
        conversationId: currentChat._id,
      };
    }

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      senderName: user.username,
      receiverId,
      text: newMessage,
      Image: file
        ? {
            name: file.name,
            image: file.base64,
          }
        : null,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/myMessages/",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
      setFile("");
    } catch (err) {
      console.log(err);
    }
  };

  // send message when enter key pressed
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(event);
    }
  };

  // create a new conversation
  const newConversation = async (friendId) => {
    try {
      const res = await axios.post("http://localhost:5000/myConversation/", {
        senderId: user._id,
        recieverId: friendId,
      });
      if (res.data.message == "Conversation Exists")
        handleConvoClick(res.data.data[0]);
      else {
        getConversations();
        handleConvoClick(res.data);
      }
    } catch (err) {
      console.log(err);
    }
    // console.log(res);
  };

  const handleConvoClick = (convo) => {
    console.log(convo);
    setCurrentChat(convo);
    const friendId = convo.members.find((m) => m !== user?._id);
    axios
      .get(`http://localhost:5000/emp/${friendId}`)
      .then((rec) => {
        setFriend(rec.data);
        // console.log(rec.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getConversations();
  };
  const handleDeleteChat = () => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete the chat?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete("/myConversation/deleteconversation", {
                data: { _id: currentChat._id },
              })
              .then((rec) => {
                // console.log(rec.data);
                const fitleredConversations = conversations.filter(
                  (convo) => rec.data._id !== convo._id
                );
                setCurrentChat();
                setConversations(fitleredConversations);
                toast.success("Chat Deleted");
              })
              .catch((err) => console.log(err));
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const getDifference = (array1, array2) => {
    return array1.filter((object1) => {
      return array2.some((object2) => {
        return object1.members.includes(object2._id);
      });
    });
  };

  const getDifferenceOnlineAndUsers = (array1, array2) => {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1._id === object2.userId;
      });
    });
  };

  const handleSearchChange = (e) => {
    // console.log(conversations);
    setTimeout(() => {
      const value = e.target.value;
      if (value === null || value === "" || value === undefined) {
        // console.log("hello");
        getConversations();
      } else {
        axios
          .get(`/emp/getuserbyname/${value}`)
          .then((rec) => {
            // console.log(rec.data);
            const filteredConvos = getDifference(conversations, rec.data);
            setConversations(filteredConvos);
          })
          .catch((err) => console.log(err));
      }
    }, 1000);
  };

  //   Get All Employees
  const fetchData = async () => {
    // get the data from the api
    if (localStorage.getItem("role") == "Employee") {
      const res = await axios.get(
        "http://localhost:5000/emp/getcompanyemployees",
        { params: { _id: user._id } }
      );
      //   console.log(res.data);
      const response = await axios.get("http://localhost:5000/emp/getmyadmin", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
      var withoutMe = res.data.filter((emp) => emp._id != user._id);
      // set employees that are not online right now
      setNotOnlineEmployees(
        getDifferenceOnlineAndUsers(
          [...withoutMe, response.data[0]],
          onlineUsers
        )
      );
    } else {
      const res = await axios.get("http://localhost:5000/emp/getmyemployees", {
        params: { _id: JSON.parse(localStorage.getItem("user"))._id },
      });
      var withoutMe = res.data.filter((emp) => emp._id != user._id);
      setNotOnlineEmployees(
        getDifferenceOnlineAndUsers(withoutMe, onlineUsers)
      );
      // console.log(getDifferenceOnlineAndUsers(withoutMe, onlineUsers));
    }
  };
  useEffect(() => {
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  return (
    <div className="messenger-container">
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <ChatMenu
              newConversation={newConversation}
              user={user}
              handleSearchChange={handleSearchChange}
            />
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            {/* <SearchBar
              placeholder="Search for friends"
              employees={employees}
              setEmployees={setEmployees}
              newConversation={newConversation}
            /> */}
            {/* <Conversation />
            <Conversation /> */}
            {/* Show all conversations of Naseer 6262243469482d6b557e3b59 */}
            <div className="conversation-container">
              {conversations?.map((convo) => (
                <div
                  className="px-4 pt-2"
                  onClick={() => handleConvoClick(convo)}
                >
                  <Conversation conversation={convo} currentUser={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                {/* <div
                  style={{
                    width: "auto",
                    height: "80px",
                    backgroundColor: "#F9F6EE",
                    display: "flex",
                    marginBottom: "10px",
                  }}
                  >
                  <img
                  className="chatProfileImg"
                  src={friend?.profilePicture}
                  alt="No picture"
                  style={{ height: "fitContent" }}
                  />
                  <h1 style={{ color: "FFEFD5" }}>{friend?.username}</h1>
                </div> */}
                <div className="chat-box-header-container">
                  <ChatBoxHeader
                    friend={friend}
                    handleDeleteChat={handleDeleteChat}
                  />
                </div>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === user?._id}
                        userPhoto={user?.profilePicture}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <div className="col">
                    <div className="position-relative chat-menu-search-bar chat-footer">
                      <FileUpload file={file} setFile={setFile} />
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="chat-input"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e)}
                        autoComplete="off"
                      />
                      <SendIcon
                        className="send-message-icon"
                        onClick={handleSendMessage}
                      />
                    </div>
                  </div>
                  {/* <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    value={newMessage}
                  ></textarea> */}
                  {/* <button
                    onClick={handleSendMessage}
                    className="chatSubmitButton"
                  >
                    Send
                  </button> */}
                </div>
                <div>
                  {/* <FileBase64 multiple={false} onDone={getFiles} /> */}
                  {/* {file && (
                    <img
                      src={file}
                      alt="No Image"
                      style={{
                        width: "100px",
                        height: "60px",
                        marginTop: "5px",
                      }}
                    />
                  )} */}
                </div>
              </>
            ) : (
              <span className="noConversationText">
                No Chat. Open Conversation to start a chat
              </span>
            )}
          </div>
          {file && (
            <Alert
              variant="danger"
              onClose={() => setFile("")}
              dismissible
              className="alert-dismiss-custom rounded-pill font-size-12 mb-1 selected-media"
              closeClassName="selected-media-close"
            >
              <p className="">You have Selected a file</p>
            </Alert>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="left-right-icon-container">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250 }}
              overlay={renderTooltip}
            >
              <div
                className="left-right-icon"
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              >
                {showOnlineUsers ? (
                  <ChevronRightIcon className="btn btn-soft-primary btn-sm" />
                ) : (
                  <ChevronLeftIcon className="btn btn-soft-primary btn-sm" />
                )}
              </div>
            </OverlayTrigger>
          </div>
        </div>
        {showOnlineUsers && (
          <div className="chatOnline">
            <div className="chatOnlineWrapper">
              {onlineUsers?.length > 0 ? (
                <ChatOnline
                  onlineUsers={onlineUsers}
                  currentId={user?._id}
                  newConversation={newConversation}
                />
              ) : (
                <h2>No Online Users</h2>
              )}
              <div className="">
                {notOnlineEmployees?.map((o) => {
                  return (
                    <div
                      className="chatOnlineFriend"
                      onClick={() => newConversation(o._id)}
                    >
                      <div className="chatOnlineImgContainer">
                        <img
                          className="chatOnlineImg"
                          src={o?.profilePicture}
                          alt=""
                        />
                      </div>
                      <span className="chatOnlineName">{o?.username}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
