import React from 'react';
import InputField from './InputField'; // Assuming InputField is a reusable input component

const RegistrationForm = ({ handleSubmit, firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword }) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={(e) => handleSubmit(e)}>
      <div className="-space-y-px rounded-md shadow-sm">
        <InputField
          id="first-name"
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="rounded-t-md"
        />
        <InputField
          id="last-name"
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <InputField
          id="email-address"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-b-md"
        />
        <InputField
          id="confirmPassword"
          label="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-b-md"
        />
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
