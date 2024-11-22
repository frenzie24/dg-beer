import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const GameList = ({ user, games }) => {
    const navigate = useNavigate();
    const handleClick = (game) => {
        let _state = { ...game };
        _state.user = user;
        console.log(`Game ID: ${game.id} clicked!`);
        navigate('/game',{ state: _state})
    };

    return (
        <div>
            <ol>
                {games.map((game) => (
                    <li key={game.id} onClick={() => handleClick(game)}>
                        <h2>Game ID: {game.id}</h2>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default GameList;
