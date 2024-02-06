import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState(null);
    const [guess, setGuess] = useState(0);
    const [response, setResponse] = useState(0);
    const [timer, setTimer] = useState(30);
    const [rounds, setRounds] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (gameState && gameState.gameStarted && timer > 0) {
            const timeout = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timeout);
        }
    }, [gameState, timer]);

    useEffect(() => {
        if (rounds === 5) {
            setGameOver(true);
            setWinner(gameState.score.team1 > gameState.score.team2 ? 'team1' : 'team2');
        }
    }, [rounds, gameState]);

    const createTeams = () => {
        axios.post('/createTeams', { players })
            .then(res => setGameState(res.data))
            .catch(err => console.error(err));
    };

    const startGame = () => {
        axios.post('/startGame')
            .then(res => {
                setGameState(res.data);
                setTimer(30); // Reset the timer to 30 seconds when the game starts
            })
            .catch(err => console.error(err));
    };

    const submitGuess = () => {
        axios.post('/submitGuess', { guess })
            .then(res => setGameState(res.data))
            .catch(err => console.error(err));
    };

    const submitResponse = () => {
        axios.post('/submitResponse', { response })
            .then(res => {
                setGameState(res.data);
                setRounds(rounds + 1); // Increment the round count after each round
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <input type="text" onChange={e => setPlayers(e.target.value.split(','))} />
            <button onClick={createTeams}>Create Teams</button>
            {gameState && <div>
                <button onClick={startGame}>Start Game</button>
                <input type="number" onChange={e => setGuess(e.target.value)} />
                <button onClick={submitGuess}>Submit Guess</button>
                <input type="number" onChange={e => setResponse(e.target.value)} />
                <button onClick={submitResponse}>Submit Response</button>
                <div>{JSON.stringify(gameState)}</div>
                <div>Time remaining: {timer} seconds</div>
                <div>Current round: {rounds + 1} / 5</div> {/* Display the current round number */}
                {gameOver && <div>Game over! The winner is {winner}!</div>}
            </div>}
        </div>
    );
}

export default App;