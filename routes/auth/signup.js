const express = require("express");
const route = express.Router();
const user = require("../../schema/user");
route.post("/", (req, res) => {
  user.findOne({ username: req.query.username }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      res.redirect("/");
    } else {
      user({
        name: req.query.user,
        username: req.query.user,
        email: req.query.email
      }).save((err, data) => {
        res.redirect("/");
      });
    }
  });
});

module.exports = route;