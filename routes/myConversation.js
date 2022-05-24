var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Conversation = require("../model/myConversation.model");

// create a new conversation
router.post("/", async (req, res) => {
    // create a new conversation with filling the array
    // in memebers array the sedener id and the reciever id will go
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  // add to mongo
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
// only return result that contains userId
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    // console.log(conversation);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;