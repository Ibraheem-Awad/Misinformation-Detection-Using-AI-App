# TruthLens: An AI-Powered Misinformation Detection Tool

TruthLens is a web application built to help users critically evaluate the truthfulness of online content like social media posts, headlines, and short articles. Instead of giving a final "true" or "false" answer, the tool provides several layers of analysis to help users spot potential problems and encourage them to do their own research.

This project was developed as the final project for the "בין תיאוריה למעשה, הכנה לאתגרי עולם המחשוב" course. 

---

## Features

* **AI Content Analysis:** Classifies text into categories like "misinformation," "opinion," and "satire" using a zero-shot classification model, and displays a full breakdown of the AI's confidence scores.
* **Logical Fallacy Detection:** Scans text for common logical fallacies, such as "Ad Hominem," "Slippery Slope," and "Appeal to Emotion."
* **Recent News Search:** Searches for recent news articles related to the input text using the GNews API to provide real-world context.
* **External Research Links:** Provides automatically generated search links to Google News, Wikipedia, and Snopes to encourage further investigation.
* **Analysis History:** Saves past analysis results to the browser's local storage for easy access, with the ability to show, hide, and clear the history panel.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express
* **AI Analysis:** Hugging Face Inference API (`facebook/bart-large-mnli` model)
* **News Source:** GNews API
* **Development Environment:** WebStorm

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (version 14 or later)
* npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Ibraheem-Awad/Misinformation-Detection-Using-AI-App
    ```

2.  **Navigate into the project directory:**
    ```sh
    cd Misinformation-Detection-Using-AI-App
    ```

3.  **Install Backend Dependencies:**
    ```sh
    cd server
    npm install
    ```

4.  **Install Frontend Dependencies:**
    ```sh
    cd ../client
    npm install
    ```

### Configuration

This project requires API keys to connect to external services.

1.  In the `server` directory, create a new file named `.env`.
2.  Open the `.env` file and add the following lines, replacing `YourKeyHere` with your actual API keys:

    ```
    HUGGINGFACE_API_KEY=YourKeyHere
    GNEWS_API_KEY=YourKeyHere
    ```

### Usage

You will need to run the backend server and the frontend client in two separate terminals.

1.  **Run the Backend Server:**
    * Navigate to the `server` directory.
    * Run the following command:
        ```sh
        node index.js
        ```
    * The server should now be running on `http://localhost:3001`.

2.  **Run the Frontend Client:**
    * Navigate to the `client` directory.
    * Run the following command:
        ```sh
        npm start
        ```
    * The application should automatically open in your web browser at `http://localhost:3000`.
