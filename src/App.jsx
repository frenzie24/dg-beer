// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';  // Import Login component
import Registration from './Registration';  // Import Registration component
import Profile from './Profile';  // Import UserProfile component
import Game from "./Game";
import GameSettings from './GameSettings';

const App = () => {
  return (
    <div className="w-screen h-screen bg-slate-900 text-slate-100">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gamesettings" element={<GameSettings />} />
          <Route path="/game" element={<Game />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
