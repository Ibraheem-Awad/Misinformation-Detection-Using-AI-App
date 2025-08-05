// client/src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import ResultDisplay from './ResultDisplay';

function App() {
    const [inputText, setInputText] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [history, setHistory] = useState([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('analysisHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load history from localStorage", error);
        }
    }, []);

    // --- THIS IS THE CORRECTED LOGIC ---
    useEffect(() => {
        // Only save to history if we have a valid result with labels and scores
        if (analysisResult && analysisResult.labels && analysisResult.scores) {

            // First, determine the top label and score from the arrays
            const highestScoreIndex = analysisResult.scores.indexOf(Math.max(...analysisResult.scores));
            const topLabel = analysisResult.labels[highestScoreIndex];
            const topScore = (analysisResult.scores[highestScoreIndex] * 100).toFixed(0);

            // Now, create a history entry with the simple, flattened result
            const newHistoryEntry = {
                text: inputText,
                result: {
                    label: topLabel,
                    score: topScore
                },
                timestamp: new Date().toISOString(),
            };

            // Add new entry to the top of the history list
            const updatedHistory = [newHistoryEntry, ...history].slice(0, 10);
            setHistory(updatedHistory);
            localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analysisResult]);

    const handleAnalyzeClick = () => {
        if (!inputText.trim()) {
            setError("Please enter some text to analyze.");
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);

        fetch('http://localhost:3001/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText }),
        })
            .then(response => response.json())
            .then(data => {
                setAnalysisResult(data.error ? { label: 'Error', score: 'N/A' } : data.analysis);
            })
            .catch(error => {
                console.error("There was an error fetching the data:", error);
                setAnalysisResult({ label: 'Error', score: 'N/A' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleClearClick = () => {
        setInputText("");
        setAnalysisResult(null);
        setError("");
    };

    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem('analysisHistory');
    };

    const handleHistoryClick = (text) => {
        setInputText(text);
    };

    const toggleHistoryVisibility = () => {
        setIsHistoryVisible(!isHistoryVisible);
    };

    return (
        <div className="App">
            <div className="main-content">
                <header className="App-header">
                    <h1>TruthLens</h1>
                    <p>Enter text below to analyze for misinformation.</p>

                    <textarea
                        style={{ width: '80%', minHeight: '100px', fontSize: '16px', padding: '10px' }}
                        value={inputText}
                        onChange={e => {
                            setInputText(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="Paste a tweet, headline, or post here..."
                    />

                    {error && <p style={{ color: '#ff4d4d', fontSize: '14px', margin: '10px 0 0 0' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button onClick={handleAnalyzeClick} className="action-btn" disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Analyze Text'}
                        </button>
                        <button onClick={handleClearClick} className="action-btn secondary-btn" disabled={isLoading}>
                            Clear
                        </button>
                        <button onClick={toggleHistoryVisibility} className="action-btn secondary-btn">
                            {isHistoryVisible ? 'Hide History' : 'Show History'}
                        </button>
                    </div>

                    {analysisResult && <ResultDisplay result={analysisResult} originalText={inputText} />}
                </header>
            </div>

            {isHistoryVisible && (
                <div className="history-sidebar">
                    <h2>History</h2>
                    {history.length > 0 ? (
                        <>
                            <button onClick={handleClearHistory} className="clear-history-btn">Clear History</button>
                            <ul>
                                {history.map((item, index) => (
                                    <li key={index} onClick={() => handleHistoryClick(item.text)}>
                                        <span className={`history-label history-label-${item.result.label.replace(' ', '-')}`}>{item.result.label}</span>
                                        <p>{item.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No history yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;