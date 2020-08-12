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
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs')
app.set('views','views');
app.use('/peerjs',peerServer);
app.get('/',(req,res,next)=>{
    res.redirect('/'+uuidv4());
})
app.get('/:room',(req,res,next)=>{
    //console.log(req.params)
    res.render('zoom',{
        roomId:req.params.room
    })
})
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        console.log('joined')
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        })
    })
   
})
server.listen(3030,()=>{
    console.log("Server Started at 3000!")
})