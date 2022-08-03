var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const Message = require("../model/myMessage.model");

//add message

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post("/uploadFile", async (req, res) => {
//   // console.log(req.body.file);

//   const newImage = new Image({
//     name: req.body.name,
//     image: req.body.image,
//   });

//   try {
//     const savedMessage = await newImage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// router.get("/getAllImages", function (req, res, next) {
//   Image.find({}).exec((error, records) => {
//     if (error) throw error;
//     res.json(records);
//   });
// });

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
