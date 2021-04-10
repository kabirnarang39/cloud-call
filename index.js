const express=require('express');
const app=express();
const path=require('path')
const server=require('http').Server(app);
const io=require('socket.io')(server)
const { v4 : uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const cookie = require("cookie-session");
const passport = require("passport");
const mongoose = require("mongoose");
const peerServer = ExpressPeerServer(server,{ 
    debug:true
});
const peerUser = require("./schema/peerUser");
const room = require("./schema/rooms");
const videoRoom = require("./routes/video");
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login");
const logout = require("./routes/auth/logout");
mongoose
  .connect('mongodb+srv://kabir:9416285188@cluster0.mi2bs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("database connected");
  });
var  roomData = { count: 1};
app.use('/peerjs',peerServer);
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }));
app.use(cookie({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ["soumenkhara"] }));
app.use(passport.initialize());
app.use(passport.session());
app.set('views','views');
app.use(express.static(path.join(__dirname,'public')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.post("/join-room", (req, res) => {
    res.redirect(`/${req.body.room_id}`);
  });
  
  // user id get
  app.get("/user", async (req, res) => {
    const roomData = await room.findOne({ roomId: req.query.room }).exec();
    res.json({
      user: await peerUser.findOne({ peerId: req.query.peer }).exec(),
      admin: roomData.admin,
    });
  });

  // login
  app.use("/login", login);
  
  // signup
  app.use("/signup", signup);
  
  // logout
  app.use("/logout", logout);
  app.get('/meet-end',(req,res,next)=>{
    res.render('meet-end')
})
  // video room
app.use("/", videoRoom);


/*
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId,username,image)=>{
       
        socket.join(roomId);
       socket.to(roomId).broadcast.emit('user-connected',userId,username,image,roomData.count + 1)
       socket.on("video-toggle", async (type) => {
        socket.to(roomId).broadcast.emit("user-video-toggle", userId, type);
      });
        socket.on('message',(message,username,image)=>{
            io.to(roomId).emit('createMessage',message,username,image)
        })
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId,roomData.count - 1)
          })
    })
   
})*/io.on("connection", (socket) => {
  socket.on("join-room", async (roomId, peerId, userId, name, audio, video) => {
    // add peer details
    await peerUser({
      peerId: peerId,
      name: name,
      audio: audio,
      video: video,
    }).save();
    // add room details
    var roomData = await room.findOne({ roomId: roomId }).exec();
    if (roomData == null) {
      await room({
        roomId: roomId,
        userId: userId,
        admin: peerId,
        count: 1,
      }).save();
      roomData = { count: 0 };
    } else if (roomData.userId == userId) {
      if (roomData.admin != peerId)
        await room.updateOne(
          { roomId: roomId },
          { admin: peerId, count: roomData.count + 1 }
        );
    } else
      await room.updateOne({ roomId: roomId }, { count: roomData.count + 1 });
    socket.join(roomId);
    socket
      .to(roomId)
      .broadcast.emit(
        "user-connected",
        peerId,
        name,
        audio,
        video,
        roomData.count + 1
      );
    socket.on("video-toggle", async (type) => {
      await peerUser.updateOne({ peerId: peerId }, { video: type });
      socket.to(roomId).broadcast.emit("user-video-toggle", peerId, type);
    });
    // chat
    socket.on('message',(message,username,image)=>{
        io.to(roomId).emit('createMessage',message,username,image)
    })
    socket.on("disconnect", async () => {
      roomData = await room.findOne({ roomId: roomId }).exec();
      await room.updateOne({ roomId: roomId }, { count: roomData.count - 1 });
      // remove peer details
      await peerUser.deleteOne({ peerId: peerId });
      socket
        .to(roomId)
        .broadcast.emit("user-disconnected", peerId, roomData.count - 1);
    });
  });
});
server.listen(process.env.PORT || 8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });