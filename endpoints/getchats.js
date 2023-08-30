const express= require('express')
const cors= require('cors')
const socketIO = require('socket.io')
const mongoose = require('mongoose')
const {Msg} = require('./addchats')
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb+srv://harshrajput18:Harsh1827@cluster0.efkiy6x.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


/*const dummyConversations = [
    {
      id: 1,
      name: 'John Doe',
      profilePic: 'https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg',
      messages: [
        { id: 1, sender: 'John Doe', text: 'Hey, how are you?', timestamp: '10:30 AM' },
        { id: 2, sender: 'You', text: 'I\'m good, thanks! How about you?', timestamp: '10:35 AM' },
        { id: 3, sender: 'John Doe', text: 'I\'m doing well too!', timestamp: '10:38 AM' },
        { id: 4, sender: 'You', text: 'That\'s great to hear!', timestamp: '10:40 AM' },
        // Add more messages here
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      profilePic: 'https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg',
      messages: [
        { id: 1, sender: 'Jane Smith', text: 'Hi there!', timestamp: '11:15 AM' },
        { id: 2, sender: 'You', text: 'Hello!', timestamp: '11:20 AM' },
        { id: 3, sender: 'Jane Smith', text: 'What are you up to?', timestamp: '11:25 AM' },
        { id: 4, sender: 'You', text: 'Just working on some stuff. How about you?', timestamp: '11:30 AM' },
        // Add more messages here
      ],
    },
    {
      id: 3,
      name: 'Alex Johnson',
      profilePic: 'https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg',
      messages: [
        { id: 1, sender: 'Alex Johnson', text: 'Hey, how\'s it going?', timestamp: '12:45 PM' },
        { id: 2, sender: 'You', text: 'Not bad! How about you?', timestamp: '12:50 PM' },
        { id: 3, sender: 'Alex Johnson', text: 'Just had lunch. Any plans for the day?', timestamp: '12:55 PM' },
        // Add more messages here
      ],
    },
    {
      id: 4,
      name: 'Emily Brown',
      profilePic: 'https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg',
      messages: [
        { id: 1, sender: 'Emily Brown', text: 'Hello!', timestamp: '2:00 PM' },
        { id: 2, sender: 'You', text: 'Hi Emily! How are you?', timestamp: '2:05 PM' },
        // Add more messages here
      ],
    },
    {
      id: 5,
      name: 'David Lee',
      profilePic: 'https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-4.jpg',
      messages: [
        // Add messages for David Lee here
      ],
    },
    // Add more conversations here
  ];
  */


const db =  mongoose.connection;

const Router=express.Router();

Router.use(cors());

Router.get('/',async(req,res)=>{
 

    const user= jwt.verify(req.headers.from,'THISISMYSECRETKEY')


    const msg= await Msg.find({$or:[{from:user.userid,to: new mongoose.Types.ObjectId(req.headers.to)},{from: new mongoose.Types.ObjectId(req.headers.to),to:user.userid}]});

    console.log(msg);

    res.json({msgs: msg})
    
})


module.exports = Router