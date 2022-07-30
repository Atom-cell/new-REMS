import React, { useState, useEffect, useRef } from "react";
import ChatOnline from "./ChatOnline";
import Conversation from "./Conversation";
import Message from "./Message";
import "./messenger.css";
import axios from "axios";
import SearchBar from "../Componentss/SearchBar";
import Button from "@mui/material/Button";
import FileBase64 from "react-file-base64";
import { toast } from "react-toastify";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8900");

const Messenger = ({
  onlineUsers,
  setOnlineUsers,
  notify,
  arrivalMessage,
  setArrivalMessage,
}) => {
  const [newMessage, setNewMessage] = useState();
  const [conversations, setConversations] = useState();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const scrollRef = useRef();
  const [employees, setEmployees] = useState([]);
  const [friend, setFriend] = useState();

  const [user, setUser] = useState([]);

  const [check, setCheck] = useState();

  const getFiles = (files) => {
    const type = files.base64.split(";")[0].split(":")[1];
    console.log(type);
    if (
      type.includes("image") ||
      type.includes("video") ||
      type.includes("pdf")
    ) {
      setCheck(files.base64);
    } else {
      toast.info("you can only send image or pdf or video");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // console.log(user);
      setUser(user);
    }
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.emit("addUser", user?._id);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
      // setOnlineUsers(
      //   user.followings.filter((f) => users.some((u) => u.userId === f))
      // );
    });
  }, [user]);

  // fetch all messages of the current user
  useEffect(() => {
    getConversations();
  }, [user._id]);

  const getConversations = async () => {
    // get all conversation of a specific user i-e the one that is logged in Naseer
    // naseer employee id is : 6262243469482d6b557e3b59
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
    if (check) {
      imageUrl = check;
    }
    const message = {
      sender: user?._id,
      text: newMessage,
      conversationId: currentChat._id,
      image: imageUrl,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      senderName: user.username,
      receiverId,
      text: newMessage,
      image: imageUrl,
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/myMessages/",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
      setCheck("");
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
  const newConversation = async (friendId, friendUsername) => {
    try {
      const res = await axios.post("http://localhost:5000/myConversation/", {
        senderId: user._id,
        recieverId: friendId,
      });
      getConversations();
    } catch (err) {
      console.log(err);
    }
    // console.log(res);
  };

  const handleConvoClick = (convo) => {
    setCurrentChat(convo);
    const friendId = convo.members.find((m) => m != user?._id);
    axios
      .get(`http://localhost:5000/emp/${friendId}`)
      .then((rec) => {
        setFriend(rec.data);
        // console.log(rec.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            <SearchBar
              placeholder="Search for friends"
              employees={employees}
              setEmployees={setEmployees}
              newConversation={newConversation}
            />
            {/* <Conversation />
            <Conversation /> */}
            {/* Show all conversations of Naseer 6262243469482d6b557e3b59 */}
            {conversations?.map((convo) => (
              <div onClick={() => handleConvoClick(convo)}>
                <Conversation conversation={convo} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div
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
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e)}
                    value={newMessage}
                  ></textarea>
                  <button
                    onClick={handleSendMessage}
                    className="chatSubmitButton"
                  >
                    Send
                  </button>
                </div>
                <div>
                  <FileBase64 multiple={false} onDone={getFiles} />
                  {check && (
                    <img
                      src={check}
                      alt="No Image"
                      style={{
                        width: "100px",
                        height: "60px",
                        marginTop: "5px",
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <span className="noConversationText">
                No Chat. Open Conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {onlineUsers?.length > 0 ? (
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user._id}
                setCurrentChat={setCurrentChat}
              />
            ) : (
              <h2>No Online Users</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
