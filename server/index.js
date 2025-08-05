const express = require('express');
const app = express();
const port = 3001; // Using a port other than 3000 for the backend

// A simple route to check if the server is working
app.get('/', (req, res) => {
    res.send('Hello from the backend server!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});