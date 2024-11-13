import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GameSettings = ({ }) => {
  // State for the game settings
  const [rounds, setRounds] = useState(10); // Default to 10 rounds
  const [selectedRole, setSelectedRole] = useState(0); // Default role
  const [entropyLevel, setEntropyLevel] = useState(5); // Default entropy level (1 to 10)
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for React Router navigation

  // Handle form submission to start the game
  const handleStartGame = (e) => {
    e.preventDefault();
    // Pass the settings to the parent component (or game logic)
        navigate('/game', { state: { role: Number(selectedRole), rounds: rounds, entropy:entropyLevel } });
  };
  const handleSelectRole = (e) =>{
    const val = e.target.value;
    setSelectedRole(val);
  }

  const handleOnRoundsChange = (e) => {
    const val = e.target.value > 50 ? 50 : e.target.value;

    setRounds(val);
  }

  const handleSelectEntropyLevel =(e) => {
    const val = e.target.value;
    setEntropyLevel(val);
  }

  return (
    <div className="game-settings-container p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">New Game Settings</h2>

      <form onSubmit={handleStartGame}>
        {/* Rounds Input */}
        <div className="mb-4">
          <label htmlFor="rounds" className="block text-sm text-black font-semibold">Rounds:</label>
          <input
            type="number"
            id="rounds"
            value={rounds}
            onChange={handleOnRoundsChange}
            min="1"
            className="mt-1 px-3 py-2 border rounded-md w-full"
          />
        </div>

        {/* Role Selection Dropdown */}
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm text-black font-semibold">Select Role:</label>
          <select
            id="role"
            value={selectedRole}
            onChange={handleSelectRole}
            className="mt-1 px-3 py-2 border rounded-md w-full"
            disabled={false}
          >
            <option value={0}>Retailer</option>
            <option value={1}>Wholesaler</option>
            <option value="2">Distributor</option>
            <option value="3">Manufacturer</option>
          </select>
        </div>

        {/* Random Entropy Level Dropdown */}
        <div className="mb-4">
          <label htmlFor="entropy" className="block text-sm text-black font-semibold">Entropy Level (1-10):</label>
          <select
            id="entropy"
            value={entropyLevel}
            onChange= {handleSelectEntropyLevel}
            className="mt-1 px-3 py-2 border rounded-md w-full"
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Start Game
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameSettings;
