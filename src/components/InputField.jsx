import React from 'react';

const InputField = ({ id, label, type, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium ">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className="mt-1 appearance-none rounded-md w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
