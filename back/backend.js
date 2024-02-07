const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const axios = require('axios');

let gameState = {
    players: [],
    teams: {
        team1: [],
        team2: []
    },
    score: {
        team1: 0,
        team2: 0
    },
    rounds: 0,
    category: null
};

app.post('/createTeams', (req, res) => {
    const players = req.body.players;
    
    players.sort(() => Math.random() - 0.5);
    let team1 = players.slice(0, 2);
    let team2 = players.slice(2);
    let team1Roles = { 'Gambler': team1[0], 'Responder': team1[1] };
    let team2Roles = { 'Gambler': team2[0], 'Responder': team2[1] };
    
    let categories = ['Types of Ice Cream', 'Countries in Europe', 'US States', 'Fruits', 'Animals'];
    let category = categories[Math.floor(Math.random() * categories.length)];

    gameState = { team1: team1Roles, team2: team2Roles, score: { team1: 0, team2: 0 }, rounds: 0, currentTeam: 'team1', category: category };
    
    res.json(gameState);
});

app.post('/startGame', (req, res) => {
    res.json(gameState);
});

app.post('/endRound', async (req, res) => {
    let winningTeam = gameState.response >= gameState.guess ? gameState.currentTeam : (gameState.currentTeam === 'team1' ? 'team2' : 'team1');
    gameState.score[winningTeam]++;
    gameState.rounds++;

    try {
        const response = await axios.get('http://jservice.io/api/categories?count=100');
        const categories = response.data;
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        gameState.category = randomCategory.title;
    } catch (error) {
        console.error(error);
    }

    res.json(gameState);
});

app.post('/selectWinner', (req, res) => {
    const team = req.body.team;
    gameState.score[team]++;
    gameState.rounds++;
    let categories = ['Types of Ice Cream', 'Countries in Europe', 'US States', 'Fruits', 'Animals'];
    let category = categories[Math.floor(Math.random() * categories.length)];
    gameState.category = category;
    res.json(gameState);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});