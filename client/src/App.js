// client/src/App.js
import React, {useState} from 'react';
import './App.css';
import ResultDisplay from './ResultDisplay'; // Import the new component

function App() {
    const [inputText, setInputText] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null); // Default to null
    const [isLoading, setIsLoading] = useState(false); // For a loading indicator
    const [error, setError] = useState("");

    const handleAnalyzeClick = () => {
        if (!inputText.trim()) {
            setError("Please enter some text to analyze.");
            return;
        }
        setIsLoading(true); // Start loading
        setAnalysisResult(null); // Clear previous results

        fetch('http://localhost:3001/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: inputText}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Handle potential errors from the server
                    setAnalysisResult({label: 'Error', score: 'N/A'});
                } else {
                    setAnalysisResult(data.analysis); // Set the whole analysis object
                }
            })
            .catch(error => {
                console.error("There was an error fetching the data:", error);
                setAnalysisResult({label: 'Error', score: 'N/A'});
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    };
    const handleClearClick = () => {
        setInputText("");
        setAnalysisResult(null);
        setError("");
    };
    return (
        <div className="App">
            <header className="App-header">
                <h1>TruthLens</h1>
                <p>Enter text below to analyze for misinformation.</p>

                <textarea
                    style={{ width: '80%', minHeight: '100px', fontSize: '16px', padding: '10px' }}
                    value={inputText}
                    // Clear the validation error when the user starts typing again
                    onChange={e => {
                        setInputText(e.target.value);
                        if (error) setError("");
                    }}
                    placeholder="Paste a tweet, headline, or post here..."
                />

                {/* Display the validation error message if it exists */}
                {error && <p style={{ color: '#ff4d4d', fontSize: '14px', margin: '10px 0 0 0' }}>{error}</p>}

                {/* Container for the buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                        onClick={handleAnalyzeClick}
                        style={{ padding: '10px 20px', fontSize: '16px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Text'}
                    </button>

                    <button
                        onClick={handleClearClick}
                        style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6c757d', border: 'none' }}
                        disabled={isLoading}
                    >
                        Clear
                    </button>
                </div>

                {/* Conditionally render the ResultDisplay component */}
                {analysisResult && <ResultDisplay result={analysisResult} />}

            </header>
        </div>
    );
}

export default App;