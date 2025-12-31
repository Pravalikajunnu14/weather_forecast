const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Replace with your OpenWeatherMap API key
const API_KEY = 'aa8263bcfceb432babd4c7c0d66d77bf';

let recentSearches = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint to get weather
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'City is required' });

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        // Save recent searches (max 10)
        const cityName = `${data.name}, ${data.sys.country}`;
        recentSearches = recentSearches.filter(c => c !== cityName);
        recentSearches.push(cityName);
        if (recentSearches.length > 10) recentSearches.shift();

        res.json({ data, recentSearches });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});

app.get('/recent', (req, res) => {
    res.json({ recentSearches });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
