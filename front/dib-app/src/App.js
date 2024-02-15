import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.svg';
import Teams from './teams';

function App() {
    const [players, setPlayers] = useState(['', '', '', '']);
    const [gameState, setGameState] = useState(null);
    const [timer, setTimer] = useState(30);
    const [category, setCategory] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const countdown = useRef(null);
    const [isPaused, setIsPaused] = useState(true);
    const [selectingWinner, setSelectingWinner] = useState(false);

    useEffect(() => {
        if (gameStarted && timer > 0 && !isPaused) {
            countdown.current = setInterval(() => {
                setTimer((timer) => timer - 1);
            }, 1000);
        } else if (!gameStarted || timer === 0 || isPaused) {
            clearInterval(countdown.current);
            if (timer === 0) {
                setSelectingWinner(true);
            }
        }
        return () => clearInterval(countdown.current);
    }, [gameStarted, timer, isPaused]);

    const createTeams = () => {
        axios.post('http://localhost:3000/createTeams', { players })
            .then(res => {
                setGameState(res.data);
                setCategory(res.data.category);
            })
            .catch(err => console.error(err));
    };

    const startGame = () => {
        axios.post('http://localhost:3000/startGame')
            .then(res => {
                setGameState(res.data);
                setGameStarted(true);
                setIsPaused(false);
            })
            .catch(err => console.error(err));
    };

    const pauseGame = () => {
        setIsPaused(true);
    };

    const startRound = () => {
        setIsPaused(false);
    };

    const doItB = () => {
        setTimer(10);
        setIsPaused(false);
    };

    const selectWinner = (team) => {
        axios.post('http://localhost:3000/selectWinner', { team })
            .then(res => {
                setGameState(res.data);
                setCategory(res.data.category); // Update the category
                setTimer(30); // Reset the timer
                setIsPaused(true); // Pause the game
                setSelectingWinner(false);
            })
            .catch(err => console.error(err));
    };

    const resetTimer = () => {
        setTimer(30);
        setIsPaused(true);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                {gameState ? (
                    <div>
                        <Teams gameState={gameState} />
                        <div>Category: {category}</div>
                        <div>Time remaining: {timer} seconds</div>
                        <div>Current round: {gameState.rounds + 1} / 5</div>
                        {!gameStarted && <button onClick={startGame}>Start Game</button>}
                        {gameStarted && (
                            <>
                                <button onClick={isPaused ? startRound : pauseGame}>{isPaused ? 'Start' : 'Pause'}</button>
                                <button onClick={doItB}>Do It B</button>
                                <button onClick={resetTimer}>Reset</button>
                            </>
                        )}
                        {selectingWinner && (
                            <div>
                                <button onClick={() => selectWinner('team1')}>Team 1 Wins</button>
                                <button onClick={() => selectWinner('team2')}>Team 2 Wins</button>
                            </div>
                        )}
                        {gameState.gameOver && <div>Game over! The winner is {gameState.winner}!</div>}
                    </div>
                ) : (
                    <div className="input-container">
                        <input type="text" placeholder="Player 1" onChange={e => setPlayers(prevPlayers => [...prevPlayers.slice(0, 0), e.target.value, ...prevPlayers.slice(1)])} />
                        <input type="text" placeholder="Player 2" onChange={e => setPlayers(prevPlayers => [...prevPlayers.slice(0, 1), e.target.value, ...prevPlayers.slice(2)])} />
                        <input type="text" placeholder="Player 3" onChange={e => setPlayers(prevPlayers => [...prevPlayers.slice(0, 2), e.target.value, ...prevPlayers.slice(3)])} />
                        <input type="text" placeholder="Player 4" onChange={e => setPlayers(prevPlayers => [...prevPlayers.slice(0, 3), e.target.value, ...prevPlayers.slice(4)])} />
                        <button onClick={createTeams}>Create Teams</button>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;