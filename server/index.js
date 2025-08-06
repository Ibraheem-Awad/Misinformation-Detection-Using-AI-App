require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

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

        if (analysisResult && Array.isArray(analysisResult.labels) && Array.isArray(analysisResult.scores)) {
            res.json({
                analysis: {
                    labels: analysisResult.labels,
                    scores: analysisResult.scores
                }
            });
        } else {
            throw new Error("Received an invalid or unexpected response structure from Hugging Face API.");
        }

    } catch (error) {
        console.error("Error in /api/analyze endpoint:", error);
        res.status(500).json({ error: "Failed to process the analysis." });
    }
});

app.post('/api/search-news', async (req, res) => {
    try {
        const queryText = req.body.text;
        const apiKey = process.env.GNEWS_API_KEY;

        if (!apiKey) {
            throw new Error("GNews API key not found.");
        }

        // We'll take the first 5 words of the query for a concise search
        const keywords = encodeURIComponent(queryText.split(' ').slice(0, 5).join(' '));

        const apiUrl = `https://gnews.io/api/v4/search?q=${keywords}&lang=en&max=5&apikey=${apiKey}`;

        console.log("Sending query to GNews API...");
        const response = await fetch(apiUrl);
        const newsResult = await response.json();

        console.log("Result from GNews API received.");

        // GNews returns an 'articles' array
        res.json({ articles: newsResult.articles || [] });

    } catch (error) {
        console.error("Error in /api/search-news endpoint:", error);
        res.status(500).json({ error: "Failed to perform news search." });
    }
});

app.post('/api/detect-bias', async (req, res) => {
    try {
        const receivedText = req.body.text;
        console.log('Received text to detect biases:', receivedText);

        const candidateLabels = ["ad hominem", "appeal to emotion", "strawman", "black-or-white fallacy", "slippery slope", "anecdotal"];

        const response = await fetch(HUGGINGFACE_MODEL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
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

        const biasResult = await response.json();
        console.log("Bias analysis from Hugging Face:", biasResult);

        if (biasResult && Array.isArray(biasResult.labels) && Array.isArray(biasResult.scores)) {
            res.json({
                biases: {
                    labels: biasResult.labels,
                    scores: biasResult.scores
                }
            });
        } else {
            throw new Error("Received an invalid response structure from Hugging Face API.");
        }

    } catch (error) {
        console.error("Error in /api/detect-bias endpoint:", error);
        res.status(500).json({ error: "Failed to detect biases." });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});