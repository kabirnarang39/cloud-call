const express = require("express");
const route = express.Router();
const room = require("../models/rooms");
const Avatar = require('avatar-initials')
route.get("/:room", async (req, res) => {
 // console.log(req.user)
  if(req.user){
    const gravatar_url_from_email = Avatar.gravatarUrl({
      email: req.user.email
    });
    const roomData = await room.findOne({ roomId: req.params.room }).exec();
    res.render("zoom", {
      tabName: "S-Meet",
      count: roomData ? roomData.count : 0,
      roomId: req.params.room,
      screen: req.query.screen,
      user: req.user,
      image:gravatar_url_from_email
    });
  }else{
   
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      error:'Login first',
      inputData:{
        email:'',
        password:'',
        confirmPassword:''
      },
      validationErrors:[]
    });
  }

});

module.exports = route;