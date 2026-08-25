/**
 * Validates if the given string is a valid email format.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates if the given password is at least 6 characters.
 * @param {string} password
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  if (typeof password !== 'string') return false;
  return password.length >= 6;
};

/**
 * Validates if the given value is a non-empty string after trimming whitespace.
 * @param {any} value
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value !== 'string') {
    return String(value).trim().length > 0;
  }
  return value.trim().length > 0;
};

/**
 * Validates a login form object.
 * @param {Object} formData
 * @param {string} [formData.email]
 * @param {string} [formData.password]
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateLoginForm = (formData = {}) => {
  const { email = '', password = '' } = formData || {};
  const errors = {};

  if (!validateRequired(email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(password)) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a registration form object.
 * @param {Object} formData
 * @param {string} [formData.name]
 * @param {string} [formData.email]
 * @param {string} [formData.password]
 * @param {string} [formData.confirmPassword]
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateRegisterForm = (formData = {}) => {
  const { name = '', email = '', password = '', confirmPassword = '' } = formData || {};
  const errors = {};

  if (!validateRequired(name)) {
    errors.name = 'Name is required';
  }

  if (!validateRequired(email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(password)) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!validateRequired(confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a context form object.
 * @param {Object} formData
 * @param {string} [formData.title]
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export const validateContextForm = (formData = {}) => {
  const { title = '' } = formData || {};
  const errors = {};

  if (!validateRequired(title)) {
    errors.title = 'Title is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
