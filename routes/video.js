const express = require("express");
const router = express.Router();
const room = require("../schema/rooms");

router.get("/:room", async (req, res) => {
  const roomData = await room.findOne({ roomId: req.params.room }).exec();
  
  res.render("zoom", {
    tabName: "S-Meet",
    count: roomData ? roomData.count : 0,
    roomId: req.params.room,
    screen: req.query.screen,
    image:req.query.image,
    username: req.query.user,
  });
});

module.exports = router;