require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// We now use the fetch API built into Node.js

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
//const HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli";

if (!HUGGINGFACE_API_KEY) {
    console.error("Hugging Face API key not found. Make sure you have a .env file with HUGGINGFACE_API_KEY.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

// Replace the entire app.post function in server/index.js with this one.

app.post('/api/analyze', async (req, res) => {
    try {
        const receivedText = req.body.text;
        console.log('Received text to analyze:', receivedText);

        const candidateLabels = ["accurate news", "misinformation", "opinion", "satire"];

        console.log("Sending to Hugging Face for analysis...");

        const response = await fetch(HUGGINGFACE_MODEL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: receivedText,
                parameters: { candidate_labels: candidateLabels },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Hugging Face API request failed: ${response.statusText} - ${errorBody}`);
        }

        const analysisResult = await response.json();
        console.log("Analysis from Hugging Face:", analysisResult);

        // ** CORRECTED LOGIC IS HERE **
        // First, check if the response has the 'labels' and 'scores' arrays we need.
        if (analysisResult && Array.isArray(analysisResult.labels) && Array.isArray(analysisResult.scores)) {

            // If they exist, then define our variables.
            const highestScoreIndex = analysisResult.scores.indexOf(Math.max(...analysisResult.scores));
            const topLabel = analysisResult.labels[highestScoreIndex];
            const topScore = (analysisResult.scores[highestScoreIndex] * 100).toFixed(0);

            // Now we can safely send the response.
            res.json({
                analysis: {
                    label: topLabel,
                    score: topScore
                }
            });
        } else {
            // If the response format is wrong, throw an error.
            throw new Error("Received an invalid or unexpected response structure from Hugging Face API.");
        }

    } catch (error) {
        // This will now catch errors from both the API call and our processing logic.
        console.error("Error in /api/analyze endpoint:", error);
        res.status(500).json({ error: "Failed to process the analysis." });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});