import React, { useState } from 'react';
import ErrorModal from './components/ErrorModal';
import RegistrationForm from './components/RegistrationForm'; // Import RegistrationForm
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');  // Clear error message before trying to register

    try {
      const response = await fetch('http://localhost:3001/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful');

        // Redirect to profile page after successful registration
        navigate('/profile', { state: { user: data } });
      } else {


        let errors = data.errors.map(err => err.message).join(' ');
        setErrorMessage(errors || 'Something went wrong with registration.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Create an account</h2>

        {/* Error Modal */}
        <ErrorModal
          errorMessage={errorMessage}
          onClose={() => setErrorMessage('')}  // Clear error when modal is closed
        />

        <RegistrationForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          handleSubmit={handleSubmit}  // Pass the handleSubmit function as a prop
        />
      </div>
    </div>
  );
};

export default Registration;
