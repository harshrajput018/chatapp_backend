const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors')
const jwt= require('jsonwebtoken')
const bcrypt= require('bcrypt')


const Router = express.Router();
Router.use(express.json());
Router.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://harshrajput18:Harsh1827@cluster0.efkiy6x.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Register a new user
Router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password,10);

  console.log(req.body);

  try {
    const prev= await User.find({username: username});
    if(!prev){
    const newUser = await User.create({ username, email, password:  hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    else
    res.json({ message: 'User already registered'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

Router.post('/login',async(req,res)=>{

    const {username,password} = req.body;

    const user= await User.findOne({username: username});

    

    console.log(user)

    if(user)
    {
        const isPasswordCorrect= await bcrypt.compare(password,user.password);

        if(isPasswordCorrect)
        {
            userid= user.id;
            const token = jwt.sign( {userid} , "THISISMYSECRETKEY");

            res.json({message:'login successful', token});
        }
        else res.json({message:'Some problem with the bcrypt'})
    }

    else res.json({message:'login unsuccessful'})



})

Router.get('/allusers',async(req,res)=>{
    const allusers = await User.find();

    res.json({allusers});
})



module.exports = {Router}