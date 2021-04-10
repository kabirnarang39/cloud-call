const express = require("express");
const route = express.Router();
const passport = require("passport");
route.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
module.exports = route;