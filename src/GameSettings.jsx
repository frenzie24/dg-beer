import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorModal from './components/ErrorModal';

const GameSettings = ({ }) => {
  // State for the game settings
  const [rounds, setRounds] = useState(10); // Default to 10 rounds
  const [role, setRole] = useState(0); // Default role
  const [entropy, setEntropy] = useState(5); // Default entropy level (1 to 10)
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null)
  const navigate = useNavigate(); // Use useNavigate for React Router navigation


  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission to start the game
  const handleStartGame = async (e) => {
    e.preventDefault();
    try {
      debugger;
      const response = await fetch('http://localhost:3001/api/games/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ round: 0, rounds, selectedRole: role, entropy }),
      });

      //setIsLoading(false);
      debugger;
      if (response.ok) {
        debugger;
        const data = await response.json();
        console.log('GAME CREATED:', data);
        navigate('/game', { state: { gameId: data.id, user: user, role: Number(role), rounds: rounds, entropy: entropy } });
      //  localStorage.setItem('authToken', data.token); // Store the token

        // Redirect to profile page after successful login
      } else {
        const data = await response.json();
        debugger;
        setErrorMessage(data.message || 'Oops!  We\'re not sure what happened.');
        navigate('login');
      }
    } catch (error) {
      debugger;
     //setIsLoading(false);
      setErrorMessage('An error occurred. Please try again.');
      navigate('login');
      console.error(error);
    }




  };
  const handleSelectRole = (e) => {
    const val = e.target.value;
    setRole(val);
  }

  const handleOnRoundsChange = (e) => {
    const val = e.target.value > 50 ? 50 : e.target.value;

    setRounds(val);
  }

  const handleSelectEntropy = (e) => {
    const val = e.target.value;
    setEntropy(val);
  }

  return (
    <div className="game-settings-container p-6 bg-gray-100 rounded-md shadow-md">
      <ErrorModal
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
      <h2 className="text-2xl font-bold mb-4">New Game Settings</h2>

      <form >
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
            value={role}
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
          <label htmlFor="entropy" className="block text-sm text-black font-semibold">Random Entropy Level (1-10):</label>
          <select
            id="entropy"
            value={entropy}
            onChange={handleSelectEntropy}
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
            onClick={handleStartGame}
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
