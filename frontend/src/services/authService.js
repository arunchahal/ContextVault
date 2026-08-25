const AUTH_KEY = 'contextvault_auth';
const USER_KEY = 'contextvault_user';

export const login = (email, password) => {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Mock checking DB, retrieve or create user
  const user = {
    id: '1',
    name: email.split('@')[0],
    email: email
  };

  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { success: true, user };
};

export const register = (data) => {
  const { name, email, password, confirmPassword } = data;
  
  if (!name) {
    return { success: false, error: 'Name is required' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email address' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' };
  }

  const user = {
    id: Date.now().toString(),
    name,
    email
  };

  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { success: true, user };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const updateProfile = (data) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, error: 'Not authenticated' };

  const updatedUser = { ...currentUser, ...data };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return { success: true, user: updatedUser };
};
