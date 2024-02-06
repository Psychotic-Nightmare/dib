const express = require('express');
const app = express();
let gameState = {};

app.use(express.json()); // This line is needed to parse JSON from the request body

app.post('/createTeams', (req, res) => {
    // This is where you would implement the team creation and role assignment logic
    let players = req.body.players;
    players.sort(() => Math.random() - 0.5);
    let team1 = players.slice(0, 2);
    let team2 = players.slice(2);
    let team1Roles = { 'Gambler': team1[0], 'Responder': team1[1] };
    let team2Roles = { 'Gambler': team2[0], 'Responder': team2[1] };
    gameState = { team1: team1Roles, team2: team2Roles, score: { team1: 0, team2: 0 }, rounds: 0, currentTeam: 'team1' };
    res.json(gameState);
});

app.post('/startGame', (req, res) => {
    // Select a random category
    let categories = ['Types of Ice Cream', 'Countries in Europe', 'US States', 'Fruits', 'Animals'];
    let category = categories[Math.floor(Math.random() * categories.length)];
    gameState.category = category;
    res.json(gameState);
});

app.post('/submitGuess', (req, res) => {
    // Update the game state with the gambler's guess
    let guess = req.body.guess;
    gameState.guess = guess;
    res.json(gameState);
});

app.post('/submitResponse', (req, res) => {
    // Compare the responder's response to the gambler's guess and update the game state
    let response = req.body.response;
    let winningTeam = response >= gameState.guess ? gameState.currentTeam : (gameState.currentTeam === 'team1' ? 'team2' : 'team1');
    gameState.score[winningTeam]++;
    gameState.rounds++;

    // Check if the game is over
    if (gameState.rounds === 5) {
        gameState.gameOver = true;
        gameState.winner = gameState.score.team1 > gameState.score.team2 ? 'team1' : 'team2';
    } else {
        // Switch the current team
        gameState.currentTeam = gameState.currentTeam === 'team1' ? 'team2' : 'team1';
    }

    res.json(gameState);
});

app.listen(3000, () => console.log('Server running on port 3000'));