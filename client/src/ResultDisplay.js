import React from 'react';

const descriptions = {
    'misinformation': 'This label suggests the text may contain unverifiable claims or emotionally charged language. Always check sources.',
    'accurate news': 'This label suggests the text is likely factual and objective. It\'s still good practice to verify from multiple reputable sources.',
    'opinion': 'This label suggests the text primarily reflects the author\'s personal views or beliefs, not objective facts.',
    'satire': 'This label suggests the text is likely intended as humor or parody and should not be taken literally.',
    'Error': 'An error occurred while analyzing the text. Please try again.'
};

const ResultDisplay = ({ result, originalText }) => {
    if (!result || !result.labels) { // Check if result or result.labels is missing
        // This handles the initial 'Error' object case
        const label = result?.label || 'Error';
        const description = descriptions[label];
        return (
            <div className="result-box">
                <p><strong>{label}</strong></p>
                <p style={{ fontStyle: 'italic', fontSize: '14px' }}>{description}</p>
            </div>
        );
    }

    const { labels, scores } = result;

    // Find the top score to determine the overall box color
    const highestScoreIndex = scores.indexOf(Math.max(...scores));
    const topLabel = labels[highestScoreIndex];

    let boxClass = 'result-box';
    switch (topLabel) {
        case 'misinformation': boxClass += ' result-misinformation'; break;
        case 'accurate news': boxClass += ' result-accurate-news'; break;
        case 'opinion': boxClass += ' result-opinion'; break;
        case 'satire': boxClass += ' result-satire'; break;
        default: break;
    }

    const searchQuery = encodeURIComponent(originalText.split(' ').slice(0, 7).join(' '));

    return (
        <div className={boxClass}>
            <p><strong>Analysis Breakdown:</strong></p>

            {/* --- List of all scores --- */}
            <ul className="scores-list">
                {labels.map((label, index) => (
                    <li key={label}>
                        <span className="score-label">{label}</span>
                        <div className="score-bar-container">
                            <div
                                className="score-bar"
                                style={{ width: `${(scores[index] * 100).toFixed(0)}%` }}
                            ></div>
                        </div>
                        <span className="score-percent">{(scores[index] * 100).toFixed(0)}%</span>
                    </li>
                ))}
            </ul>

            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '15px 0' }} />
            <p style={{ fontStyle: 'italic', fontSize: '14px' }}>{descriptions[topLabel]}</p>

            <div className="external-links">
                <strong>Do your own research:</strong>
                <ul>
                    <li><a href={`https://news.google.com/search?q=${searchQuery}`} target="_blank" rel="noopener noreferrer">Search on Google News</a></li>
                    <li><a href={`https://www.wikipedia.org/wiki/Special:Search?search=${searchQuery}`} target="_blank" rel="noopener noreferrer">Search on Wikipedia</a></li>
                    <li><a href={`https://www.snopes.com/?s=${searchQuery}`} target="_blank" rel="noopener noreferrer">Search on Snopes</a></li>
                </ul>
            </div>
        </div>
    );
};

export default ResultDisplay;