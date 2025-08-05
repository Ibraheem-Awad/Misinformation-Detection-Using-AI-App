import React, { useState } from 'react';
import './App.css';

function App() {
    const [inputText, setInputText] = useState(""); // State for the text area
    const [analysisResult, setAnalysisResult] = useState(""); // State for the server's response

    const handleAnalyzeClick = () => {
        setAnalysisResult("Analyzing..."); // Show a loading message

        // We now use a POST request to send data to the server
        fetch('http://localhost:3001/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: inputText }), // Send the text from our text area
        })
            .then(response => response.json())
            .then(data => {
                setAnalysisResult(data.analysis);
            })
            .catch(error => {
                console.error("There was an error fetching the data:", error);
                setAnalysisResult("Error connecting to the server.");
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>TruthLens</h1>
                <p>Enter text below to analyze for misinformation.</p>

                {/* Text area for user input */}
                <textarea
                    style={{ width: '80%', minHeight: '100px', fontSize: '16px', padding: '10px' }}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Paste a tweet, headline, or post here..."
                />

                <button onClick={handleAnalyzeClick} style={{ marginTop: '15px', padding: '10px 20px', fontSize: '16px' }}>
                    Analyze Text
                </button>

                {/* Display the server's response */}
                {analysisResult && (
                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #61dafb', borderRadius: '5px', backgroundColor: '#20232a' }}>
                        <p><strong>Analysis Result:</strong></p>
                        <p>"{analysisResult}"</p>
                    </div>
                )}

            </header>
        </div>
    );
}

export default App;