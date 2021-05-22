const { v4 : uuidv4 } = require('uuid');
exports.getIndex=(req,res)=>{
    //res.send(uuidv4())
    res.render('index',{
        user:{
            name:'Kabir',
            
        },
        pageTitle:'Meet',
        path:'/',
        roomId:uuidv4()
    })
 }