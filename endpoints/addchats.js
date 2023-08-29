const express = require('express')
const cors= require('cors')
const mongoose= require('mongoose')
const jwt = require('jsonwebtoken')



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

const app = express();

app.use(cors());

app.use(express.json())

app.post('/',async(req,res)=>{

    const {from,to,content} = req.body;

    

    const user= jwt.verify(from,'THISISMYSECRETKEY')

    

    try{
    
    res.json({message:'sent successfully'})
    }
    catch(error)
    {
        console.log(error);
        res.json({message:'an error occured'})
    }

})

app.listen(8001,()=>{console.log('server is listening on port 8001')});

module.exports= {Msg}