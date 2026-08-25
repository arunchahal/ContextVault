import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  id,
  className = '',
  ...rest
}, ref) => {
  const generatedId = id || React.useId();
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={generatedId}
        className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 focus:border-indigo-500'
        }`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
