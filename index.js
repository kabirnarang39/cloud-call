/*const express=require('express');
const app=express();
const path=require('path')
const server=require('http').Server(app);
const io=require('socket.io')(server)
const { v4 : uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{ 
    debug:true
});
app.use('/peerjs',peerServer);
app.set('view engine','ejs')
app.set('views','views');
app.use(express.static(path.join(__dirname,'public')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.get('/',(req,res)=>{
   // res.redirect('/'+uuidv4());
    res.send(uuidv4())
})
app.get('/:room',(req,res)=>{
   // console.log(req.params)
    res.render('zoom',{
        roomId:req.params.room
    })
})
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId,)=>{
        socket.join(roomId);
       // console.log('joined')
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        })
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
          })
    })
   
})
server.listen(process.env.PORT || 8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  */
  const express = require("express");
  const app = express();
  const server = require("http").Server(app);
  const io = require("socket.io")(server);
  const { ExpressPeerServer } = require("peer");
  const { v4: uuid } = require("uuid");
  const cors = require("cors");
  const enforce = require("express-sslify");
  
  const port = process.env.PORT || 8000;
  const peerServer = ExpressPeerServer(server, { debug: true, path: "/" });
  const users = {};
  
  app.set("view engine", "ejs");
  
  app.use(express.static("public"));
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(cors({ origin: true }));
  app.use("/peerjs", peerServer);
  
  app.get("/", (req, res) => {
      res.send(uuid());
      res.redirect(`/room/${uuid()}`);
  });
  
  app.get("/room/:id", (req, res) => {
      const { id } = req.params;
      res.render("main", { roomID: id });
  });
  
  io.on("connection", (socket) => {
      socket.on("join-room", (roomID, userID, username) => {
          if (users[roomID]) users[roomID].push({ id: userID, name: username, video: true, audio: true });
          else users[roomID] = [{ id: userID, name: username, video: true, audio: true }];
  
          socket.join(roomID);
          socket.to(roomID).broadcast.emit("user-connected", userID, username);
  
          socket.on("message", (message) => {
              io.in(roomID).emit("message", message, userID, username);
          });
  
          io.in(roomID).emit("participants", users[roomID]);
  
          socket.on("mute-mic", () => {
              users[roomID].forEach((user) => {
                  if (user.id === userID) return (user.audio = false);
              });
              io.in(roomID).emit("participants", users[roomID]);
          });
  
          socket.on("unmute-mic", () => {
              users[roomID].forEach((user) => {
                  if (user.id === userID) return (user.audio = true);
              });
              io.in(roomID).emit("participants", users[roomID]);
          });
  
          socket.on("stop-video", () => {
              users[roomID].forEach((user) => {
                  if (user.id === userID) return (user.video = false);
              });
              io.in(roomID).emit("participants", users[roomID]);
          });
  
          socket.on("play-video", () => {
              users[roomID].forEach((user) => {
                  if (user.id === userID) return (user.video = true);
              });
              io.in(roomID).emit("participants", users[roomID]);
          });
  
          socket.on("disconnect", () => {
              socket.to(roomID).broadcast.emit("user-disconnected", userID, username);
              users[roomID] = users[roomID].filter((user) => user.id !== userID);
              if (users[roomID].length === 0) delete users[roomID];
              else io.in(roomID).emit("participants", users[roomID]);
          });
      });
  });
  
  server.listen(port, () => console.log("App is listening on port", port));