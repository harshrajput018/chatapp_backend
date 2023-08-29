const express = require('express');
const socketIO = require('socket.io');

// Create an instance of the Express app
const app = express();

// Start the server on port 3000 and listen for incoming requests
const server = app.listen(2000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Create a Socket.io server that works with the existing HTTP server
const io = socketIO(server);

// Initialize a variable to keep track of the vote count
let voteCount = 0;


let recipient="";

app.get('/',(req,res)=>{
    res.send('what up');
})

let sids=[];
// When a new client connects to the server
io.on('connection', (socket) => {
  console.log('A user connected',socket.id);

  sids.push(socket.id);
  recipient=socket.id;

  // Send the current vote count to the connected client
  socket.emit('voteCount', voteCount);

  socket.emit('msg','Welcome in This poll')

  // When the client sends a 'vote' event
  socket.on('vote', (message) => {
    // Increment the vote count
    voteCount++;

    // Send the updated vote count to all connected clients
    io.emit('voteCount', voteCount);

    

    
    io.to(sids[0]).emit('pvt','this is private')

    io.emit('broadcastmessage',message)
  });

  // When a client disconnects from the server
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Serve static files (HTML, CSS, JavaScript) from the current directory's static folder
app.use(express.static(__dirname+'/static'));
