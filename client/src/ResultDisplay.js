import React from 'react';

const descriptions = {
    'misinformation': 'This label suggests the text may contain unverifiable claims or emotionally charged language designed to mislead. Always check sources.',
    'accurate news': 'This label suggests the text is likely factual and objective. It\'s still good practice to verify from multiple reputable sources.',
    'opinion': 'This label suggests the text primarily reflects the author\'s personal views or beliefs rather than objective facts.',
    'satire': 'This label suggests the text is likely intended as humor, parody, or social commentary, and should not be taken literally.',
    'Error': 'An error occurred while analyzing the text. Please try again.'
};

const ResultDisplay = ({ result }) => {
    if (!result) return null;

    const { label, score } = result;
    let boxClass = 'result-box';
    const description = descriptions[label] || "No description available.";

    switch (label) {
        case 'misinformation': boxClass += ' result-misinformation'; break;
        case 'accurate news': boxClass += ' result-accurate-news'; break;
        case 'opinion': boxClass += ' result-opinion'; break;
        case 'satire': boxClass += ' result-satire'; break;
        default: break;
    }

    return (
        <div className={boxClass}>
            <p><strong>Analysis Result:</strong></p>
            <p>The text is most likely to be: "<strong>{label}</strong>" (Confidence: {score}%)</p>
            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '10px 0' }} />
            <p style={{ fontStyle: 'italic', fontSize: '14px' }}>{description}</p>
        </div>
    );
};

export default ResultDisplay;