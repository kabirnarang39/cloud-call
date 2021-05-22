const express = require("express");
const route = express.Router();
const room = require("../models/rooms");

route.get("/:room", async (req, res) => {
  console.log(req.user)
  const roomData = await room.findOne({ roomId: req.params.room }).exec();
  res.render("zoom", {
    tabName: "S-Meet",
    count: roomData ? roomData.count : 0,
    roomId: req.params.room,
    screen: req.query.screen,
    user: req.user,
  });
});

module.exports = route;