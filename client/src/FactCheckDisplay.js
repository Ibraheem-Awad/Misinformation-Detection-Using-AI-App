import React from 'react';

const FactCheckDisplay = ({ claims }) => {
    if (!claims) return null;

    if (claims.length === 0) {
        return (
            <div className="fact-check-container">
                <h3>Published Fact-Checks</h3>
                <p>No published fact-checks were found for this exact claim.</p>
            </div>
        );
    }

    return (
        <div className="fact-check-container">
            <h3>Published Fact-Checks</h3>
            {claims.map((claim, index) => (
                <div key={index} className="claim-review">
                    <p><strong>Claim:</strong> "{claim.text}"</p>
                    <p><strong>Publisher:</strong> {claim.claimReview[0].publisher.name}</p>
                    <p><strong>Rating:</strong> <span className="rating">{claim.claimReview[0].textualRating}</span></p>
                    <a href={claim.claimReview[0].url} target="_blank" rel="noopener noreferrer">Read the full fact-check</a>
                </div>
            ))}
        </div>
    );
};

export default FactCheckDisplay;