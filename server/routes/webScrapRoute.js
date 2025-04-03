const express = require('express');
const { chromium } = require('playwright');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const genAI = new GoogleGenerativeAI("AIzaSyDTsORvAMzWWp4jBcNoi0r9i8-XS-SVy34");
let model;

// Initialize the Google Gemini model
(async () => {
    try {
        model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Model initialized");
    } catch (err) {
        console.error("Error initializing Generative Model:", err.message);
    }
})();

// Endpoint to scrape data from a URL
router.post('/scrape', async (req, res) => {
    const { url, query } = req.body;
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log(`Scraping URL: ${url}`);
    
    await page.goto(url);
    
    const mainData = await scrapePageData(page);

    // Generate a prompt for AI based on the scraped data
    const prompt = createPrompt(mainData,query);

    try {
        const result = await model.generateContent(prompt);

        if (result.response && result.response.candidates && result.response.candidates.length > 0) {
            const generatedText = result.response.candidates[0].content;
            const newGenAIText = generatedText.parts[0].text;
            console.log("web scrapping generated ");
            
            // Send the generated text (not saving to CSV here)
            res.send({ generatedText: newGenAIText });
        } else {
            res.status(500).send({ error: "Failed to generate content." });
        }
    } catch (apiError) {
        console.error(`Error generating content for ${url}:`, apiError.message);
        res.status(500).send({ error: apiError.message });
    }

    await browser.close();
});

// Function to scrape data from the current page
async function scrapePageData(page) {
    const title = await page.title();
    const h1Tags = await page.$$eval('h1', elements => elements.map(el => el.textContent.trim()));
    const h2Tags = await page.$$eval('h2', elements => elements.map(el => el.textContent.trim()));
    const divTags = await page.$$eval('div', elements => elements.map(el => el.textContent.trim()));
    const pTags = await page.$$eval('p', elements => elements.map(el => el.textContent.trim()));

    return {
        title,
        h1Tags,
        h2Tags,
        divTags,
        pTags
    };
}

// Function to create the prompt for the Gemini API
function createPrompt(data,query) {
    return `${query}

Here is the data extracted from the website:
Title: ${data.title}
H1 Tags: ${data.h1Tags.join(" ")}
H2 Tags: ${data.h2Tags.join(" ")}
Div Tags: ${data.divTags.join(" ")}
P Tags: ${data.pTags.join(" ")}

Please provide a comprehensive analysis based on query and generate the summary return the data to a user in simple english.`;
}

module.exports = router;
