require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// We now use the fetch API built into Node.js

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

if (!HUGGINGFACE_API_KEY) {
    console.error("Hugging Face API key not found. Make sure you have a .env file with HUGGINGFACE_API_KEY.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    try {
        const receivedText = req.body.text;
        console.log('Received text to analyze:', receivedText);

        // These are the categories we want the AI to classify the text into.
        // This is perfect for your project's goal. [cite: 18]
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

        // Let's format the result into a nice string for the frontend
        let formattedResponse = "Could not determine classification.";
        if (analysisResult && analysisResult.labels) {
            const highestScoreIndex = analysisResult.scores.indexOf(Math.max(...analysisResult.scores));
            const topLabel = analysisResult.labels[highestScoreIndex];
            const topScore = (analysisResult.scores[highestScoreIndex] * 100).toFixed(0);
            formattedResponse = `The text is most likely to be: "${topLabel}" (Confidence: ${topScore}%).`;
        }

        // Send the formatted analysis back to the frontend
        res.json({
            analysis: formattedResponse
        });

    } catch (error) {
        console.error("Error calling Hugging Face API:", error);
        res.status(500).json({ error: "Failed to get analysis from AI." });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});