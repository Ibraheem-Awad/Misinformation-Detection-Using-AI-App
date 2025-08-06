import React from 'react';

const BiasDisplay = ({ biases }) => {
    if (!biases || !biases.labels) return null;

    const { labels, scores } = biases;
    const detectedBias = labels.find((label, index) => scores[index] > 0.35);
    const topScore = detectedBias ? (scores[labels.indexOf(detectedBias)] * 100).toFixed(0) : 0;

    if (!detectedBias) {
        return (
            <div className="bias-container">
                <h3>Potential Logical Fallacies</h3>
                <p>No strong indicators of the checked logical fallacies were detected.</p>
            </div>
        );
    }

    return (
        <div className="bias-container">
            <h3>Potential Logical Fallacies</h3>
            <div className="bias-item">
                <p>The text may contain an example of an "{detectedBias}" fallacy.</p>
                <p>Confidence: {topScore}%</p>
            </div>
        </div>
    );
};

export default BiasDisplay;