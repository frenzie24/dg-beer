// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';  // Import Login component
import Registration from './Registration';  // Import Registration component
import UserProfile from './UserProfile';  // Import UserProfile component
import Game from "./Game";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/game" element={<Game />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
