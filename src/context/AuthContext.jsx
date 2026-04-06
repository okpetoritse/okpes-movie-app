import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Users stored as [{ email, password, username }, ...]
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('movieAppUsersDB');
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedSession = localStorage.getItem('movieAppSession');
    if (storedSession) setUser(JSON.parse(storedSession));

    setLoading(false);
  }, []);

  const register = (email, password) => {
    // Check if email already registered
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

    // Derive a display name from the email (part before @)
    const username = email.split('@')[0];

    const newUser = { email, password, username };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('movieAppUsersDB', JSON.stringify(updatedUsers));

    // Auto login after register
    const sessionUser = { email, username, loggedInAt: new Date().toISOString() };
    setUser(sessionUser);
    localStorage.setItem('movieAppSession', JSON.stringify(sessionUser));
    return true;
  };

  const login = (email, password) => {
    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (existingUser) {
      const sessionUser = {
        email: existingUser.email,
        username: existingUser.username,
        loggedInAt: new Date().toISOString(),
      };
      setUser(sessionUser);
      localStorage.setItem('movieAppSession', JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('movieAppSession');
  };

  return (
    <AuthContext.Provider value={{ user, users, register, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
