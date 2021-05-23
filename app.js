const path=require('path')
const express=require('express');
const mongoose = require("mongoose");
const session = require('express-session');
const mongoDBStore=require('connect-mongodb-session')(session);
const csrf = require('csurf');
var cors = require('cors')
var flash=require("connect-flash")
const errorController=require('./controllers/error');
const User=require('./models/user');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{ 
  debug:true
});
const store=new mongoDBStore({
  uri:'mongodb+srv://Kabir:9416285188@cluster0-rsbgg.mongodb.net/meet',
  collection:'sessions'
})
const csrfProtection=csrf();
app.set('view engine','ejs')
app.set('views','views');
const error404=require('./routes/404')
const authRoute=require('./routes/auth')
const videoRoom = require("./routes/video");
const indexRoute=require('./routes/index')
const newMeeting = require("./routes/newMeeting");
const peerUser = require("./models/peerUser");
const room = require("./models/rooms");
mongoose
  .connect("mongodb+srv://Kabir:9416285188@cluster0-rsbgg.mongodb.net/meet", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("database connected");
  });
app.use(express.json());
app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors())
app.use(session({
  secret:'sjdfkjsjdiodsnohsoidjniousdhiolksdiucshaionhoihoiaidnqiahdioqwohdoiahsdoiahsdahsjoidhasodjaisnhiudhcoaisnchoiashchjyewf87iuhwe6474y46465454t2yuegd3qwudgy67325e63eg',
  resave:false,
  saveUninitialized:false,
  store:store
}))

app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
app.post("/join-room", (req, res) => {
  res.redirect(`/${req.body.room_id}`);
});
app.use(indexRoute)
app.get("/user", async (req, res) => {
 console.log(peerUser.findOne({ peerId: req.query.peer }).exec())
  const roomData = await room.findOne({ roomId: req.query.room }).exec();
  res.json({
    user: await peerUser.findOne({ peerId: req.query.peer }).exec(),
    admin: roomData.admin,
  });
});
app.use("/new-meeting", newMeeting);
app.use(authRoute)

app.get('/meet-end',(req,res,next)=>{
  res.render('meet-end')
})
app.use("/", videoRoom);
io.on('connection',socket=>{
  socket.on('join-room',async(roomId,peerId,userId,name,audio,video)=>{
    console.log(name)
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
     socket.to(roomId).broadcast.emit('user-connected',peerId,name,audio,video,roomData.count + 1)
     socket.on("audio-toggle", async (type) => {
      await peerUser.updateOne({ peerId: peerId }, { audio: type });
      socket.to(roomId).broadcast.emit("user-audio-toggle", peerId, type);
    });
     socket.on("video-toggle", async (type) => {
      await peerUser.updateOne({ peerId: peerId }, { video: type });
      socket.to(roomId).broadcast.emit("user-video-toggle", peerId, type);
    });
    socket.on("client-send", (data) => {
      socket.to(roomId).broadcast.emit("client-podcast", data, name);
    });
      socket.on('message',(message,username)=>{
           console.log(username,message)
          io.to(roomId).emit('createMessage',message,username)
      })
      socket.on('disconnect',async () => {
          roomData = await room.findOne({ roomId: roomId }).exec();
          await room.updateOne({ roomId: roomId }, { count: roomData.count - 1 });
          // remove peer details
          await peerUser.deleteOne({ peerId: peerId });
          socket.to(roomId).broadcast.emit('user-disconnected', peerId,roomData.count - 1)
        })
  })
 
})


//app.get('/500',errorController.get500)
app.use(error404)
app.use((error,req, res, next) => {
  return res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
      });
    });

    server.listen(process.env.PORT || 8000, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });