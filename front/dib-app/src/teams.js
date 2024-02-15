import React from 'react';

function Teams({ gameState }) {
    return (
        <div className="teams-container">
            <div className="team team1">
                <h2>Team 1</h2>
                <p>Gambler: {gameState.team1.Gambler}</p>
                <p>Responder: {gameState.team1.Responder}</p>
                <p>Score: {gameState.score.team1}</p> {/* Display Team 1 Score */}
            </div>
            <div className="team team2">
                <h2>Team 2</h2>
                <p>Gambler: {gameState.team2.Gambler}</p>
                <p>Responder: {gameState.team2.Responder}</p>
                <p>Score: {gameState.score.team2}</p> {/* Display Team 2 Score */}
            </div>
        </div>
    );
}

export default Teams;