import React, { useState, useEffect, useRef } from "react";
import ChatOnline from "./ChatOnline";
import Conversation from "./Conversation";
import Message from "./Message";
import "./messenger.css";
import axios from "axios";
import io from "socket.io-client";
import SearchBar from "../Components/SearchBar";
const socket = io.connect("http://localhost:5000");
const Messenger = () => {
  const [newMessage, setNewMessage] = useState();
  const [conversations, setConversations] = useState();
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const scrollRef = useRef();
  const [employees, setEmployees] = useState([]);

  // fetch all messages of the current user
  useEffect(() => {
    const getConversations = async () => {
      // get all conversation of a specific user i-e the one that is logged in Naseer
      // naseer employee id is : 6262243469482d6b557e3b59
      try {
        const res = await axios.get(
          "http://localhost:5000/myConversation/6262243469482d6b557e3b59"
        );
        // console.log(res.data);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
    const te = "hello";
    socket.emit("checking", te);
  }, []);

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
    const message = {
      sender: "6262243469482d6b557e3b59",
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/myMessages/",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
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
            />
            {/* <Conversation />
            <Conversation /> */}
            {/* Show all conversations of Naseer 6262243469482d6b557e3b59 */}
            {conversations?.map((convo) => (
              <div onClick={() => setCurrentChat(convo)}>
                <Conversation
                  conversation={convo}
                  currentUser="6262243469482d6b557e3b59"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === "6262243469482d6b557e3b59"}
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
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
            {/* <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
