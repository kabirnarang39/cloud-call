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
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
       // console.log('joined')
        socket.to(roomId).broadcast.emit('user-connected',userId)
        
        socket.on('screen',userId=>{
            io.to(roomId).emit('createScreen',userId)
        })
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