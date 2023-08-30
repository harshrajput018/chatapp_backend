const express = require('express');
const app = express();

// Import your endpoint code
const friendsEndpoint = require('./endpoints/friends'); // Adjust the path accordingly

// Use the endpoint router as middleware
app.use('/', friendsEndpoint);

// Set up the port
const port = process.env.PORT || 9000;

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
