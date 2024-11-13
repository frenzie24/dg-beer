// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import LoginForm from './components/LoginForm';
import ErrorModal from './components/ErrorModal';  // Import the ErrorModal

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate for React Router navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token); // Store the token

        // Redirect to profile page after successful login
        navigate('/profile', { state: { user: data.user } });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('An error occurred. Please try again.');
      console.error(error);
    }
  };

  const navigateToRegister = () => {
    navigate('/register'); // Use navigate() for React Router navigation to the Register page
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>

        {/* Error Modal */}
        <ErrorModal
          errorMessage={errorMessage}
          onClose={() => setErrorMessage('')}  // Reset error message when modal is closed
        />

        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          navigateToRegister={navigateToRegister}  // Pass navigateToRegister to LoginForm
        />

        {isLoading && (
          <div className="text-center text-gray-500">Logging in...</div>
        )}
      </div>
    </div>
  );
};

export default Login;
