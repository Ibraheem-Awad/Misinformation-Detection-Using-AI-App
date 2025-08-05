require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
//const HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli";

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

app.post('/api/factcheck', async (req, res) => {
    try {
        const queryText = req.body.text;
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            throw new Error("Google API key not found.");
        }

        // The language code is optional but recommended
        const languageCode = "en";
        const apiUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(queryText)}&languageCode=${languageCode}&key=${apiKey}`;

        console.log("Constructed Google API URL:", apiUrl);

        console.log("Sending query to Google Fact Check API...");
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Google Fact Check API request failed: ${errorBody.error.message}`);
        }

        const factCheckResult = await response.json();
        console.log("Result from Google Fact Check API received.");

        console.log("Full Google API Response:", JSON.stringify(factCheckResult, null, 2));

        console.log("Result from Google Fact Check API received.");

        // The API returns an object that contains a 'claims' array.
        // We will send this array directly to the frontend.
        res.json({ claims: factCheckResult.claims || [] });

    } catch (error) {
        console.error("Error in /api/factcheck endpoint:", error);
        res.status(500).json({ error: "Failed to perform fact-check." });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});