// src/components/LoginForm.js

import React from 'react';
import InputField from './InputField';

const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit, navigateToRegister }) => {
  return (
    <form className="mt-8 space-y-6 border-2 border-[#dacaa6] rounded-lg" onSubmit={handleSubmit}>
      <input type="hidden" name="remember" value="true" />
      <div className="-space-y-px rounded-md shadow-sm">
        <InputField
          id="email-address"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-t-md"
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-b-md"
        />
      </div>
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center text-3xl font-bold">Welcome to the Beer Game</h1>
        <div className="grid grid-cols-2 gap-4">

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600  rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>

          <button
            type="button"
            onClick={navigateToRegister}
            className="px-4 py-2 bg-green-600  rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Register
          </button>
        </div>

      </div>
    </form>
  );
};

export default LoginForm;
