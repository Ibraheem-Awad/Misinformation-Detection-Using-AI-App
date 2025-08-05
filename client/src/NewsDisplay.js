import React from 'react';

const NewsDisplay = ({ articles }) => {
    if (!articles) return null;

    if (articles.length === 0) {
        return (
            <div className="news-container">
                <h3>Recent News Articles</h3>
                <p>No relevant news articles were found for this topic.</p>
            </div>
        );
    }

    return (
        <div className="news-container">
            <h3>Recent News Articles</h3>
            {articles.map((article, index) => (
                <div key={index} className="article-item">
                    <p className="article-title">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                    </p>
                    <p className="article-source"><strong>Source:</strong> {article.source.name}</p>
                </div>
            ))}
        </div>
    );
};

export default NewsDisplay;