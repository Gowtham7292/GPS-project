const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { findPaths, findShortestPath } = require('./pathLogic');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/cities', async (req, res) => {
    try {
        const response = await axios.get('https://gist.githubusercontent.com/dastagirkhan/00a6f6e32425e0944241/raw/33ca4e2b19695b2b93f490848314268ed5519894/gistfile1.json');
        const citiesData = response.data;
        res.json(citiesData);
    } catch (error) {
        console.error('Error fetching city', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/paths', (req, res) => {
    const selectedCities = req.body.selectedCities;
    const paths = findPaths(selectedCities);
    res.json(paths);
});

app.post('/api/shortest-path', (req, res) => {
    const selectedCities = req.body.selectedCities;
    const shortestPath = findShortestPath(selectedCities);
    res.json(shortestPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
