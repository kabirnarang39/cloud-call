const express=require('express');
const app=express();
const screenshot=require('screenshot-desktop');
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
app.get('/meet-end',(req,res,next)=>{
    res.render('meet-end')
})
app.get('/:room',(req,res)=>{
   // console.log(req.params)
    res.render('zoom',{
        roomId:req.params.room,
        screenshot:screenshot()
    })
})
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId,username)=>{
        socket.join(roomId);
       // console.log('joined')
       
       socket.to(roomId).broadcast.emit('user-connected',userId,username)
       
        socket.on('message',(message,username)=>{
            io.to(roomId).emit('createMessage',message,username)
        })
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
          })
    })
   
})
server.listen(process.env.PORT || 8000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });