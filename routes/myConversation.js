var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Conversation = require("../model/myConversation.model");
const Message = require("../model/myMessage.model");

// create a new conversation
router.post("/", (req, res) => {
  // console.log(req.body.senderId);
  // create a new conversation with filling the array
  // in memebers array the sedener id and the reciever id will go
  Conversation.find(
    {
      $expr: {
        $setEquals: ["$members", [req.body.senderId, req.body.recieverId]],
      },
    },
    async (err, rec) => {
      if (err) res.status(500).json(rec);
      // match found hence no need to create another conversation
      if (rec.length > 0)
        res.status(200).send({ message: "Conversation Exists", data: rec });
      else {
        // create new conversation
        const newConversation = new Conversation({
          members: [req.body.senderId, req.body.recieverId],
        });

        // add to mongo
        try {
          const savedConversation = await newConversation.save();
          res.status(200).json(savedConversation);
        } catch (errr) {
          res.status(500).json(errr);
        }
      }
    }
  );
});

//get conv of a user
// only return result that contains userId
router.get("/:userId", async (req, res) => {
  // console.log(req.params.userId);
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    // res.status(500).json(err);
    console.log(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteconversation", (req, res) => {
  //delete conversation
  // then in message model delete all messages that has given conversation id
  console.log(req.body._id);
  Conversation.findByIdAndRemove({ _id: req.body._id }, (err, rec) => {
    if (err) res.status(500).json(err);
    Message.deleteMany({ conversationId: req.body._id }, (errr, recc) => {
      if (errr) res.status(500).json(errr);
      res.status(200).json(rec);
    });
  });
});

module.exports = router;
