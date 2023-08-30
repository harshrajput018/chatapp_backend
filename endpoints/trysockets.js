const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken')
const mongoose= require('mongoose')


mongoose.connect('mongodb+srv://harshrajput18:Harsh1827@cluster0.efkiy6x.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db=mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const msgSchema = new mongoose.Schema({
    from: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: String,
    timeStamp:{ type : Date, default: Date.now }
  });

const Msg = mongoose.model('Msg',msgSchema);  


const cors = require('cors');

const Router = express.Router();
const server = http.createServer(Router);
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

// Enable CORS
Router.use(cors());


const mapsidtouid= new Map();

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const {token} = socket.handshake.auth;

  // on new socket generation map new socket id to userid
  const userid= jwt.verify(token,'THISISMYSECRETKEY')
  console.log(userid.userid)
  mapsidtouid.delete(userid.userid);
  mapsidtouid.set(userid.userid,socket.id)


  

  //get content, userid (from,to) from received msg
  socket.on('send',async(res)=>{
    
  
    const user= jwt.verify(res.fromtoken,'THISISMYSECRETKEY')

    try{
        const newMsg = await Msg.create({ from: user.userid, to:res.to, content:res.content });
        
        }
        catch(error)
        {
            console.log(error);
            
        }


    const msg= await Msg.find({$or:[{from:user.userid,to: new mongoose.Types.ObjectId(res.to)},{from: new mongoose.Types.ObjectId(res.to),to:user.userid}]});

    console.log(msg)
  

  //send to the user the emitted msg from client
  console.log(mapsidtouid.get(res.to))
  io.to(mapsidtouid.get(res.to)).emit('send',{
    msgs:msg
  })
  io.to(mapsidtouid.get(user.userid)).emit('send',{
    msgs:msg
  })
  })

  //check for authentication using jwt from client
 
  

  


  

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


