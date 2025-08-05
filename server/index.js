const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // **IMPORTANT**: This middleware is needed to parse JSON bodies

// We'll change the GET endpoint to a POST endpoint
app.post('/api/analyze', (req, res) => {
    // The frontend sends the text in the request's "body"
    const receivedText = req.body.text;

    console.log('Received text to analyze:', receivedText);

    // We "echo" the text back to confirm we received it
    res.json({
        echo: `Server received the following text for analysis: "${receivedText}"`
    });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});