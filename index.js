const express=require('express');
const app=express();
const path=require('path')
const server=require('http').Server(app);
const io=require('socket.io')(server)
const { v4 : uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{ 
    debug:true
});
var  roomData = { count: 1};
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
app.get('/meet-end',(req,res,next)=>{
    res.render('meet-end')
})
app.get('/:room',(req,res)=>{
   // console.log(req.params)
    res.render('zoom',{
        roomId:req.params.room,
       username:req.query.user,
       image:req.query.image
    })
})
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
   
})
server.listen(process.env.PORT || 8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });