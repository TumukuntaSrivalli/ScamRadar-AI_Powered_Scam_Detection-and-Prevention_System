import React, { useState } from 'react';
import { API_BASE_URL } from '../apiConfig';

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain both letters and numbers.';
  }
  return null;
};

export default function AuthModal({ isOpen, onClose, setCurrentUser, usersList, setUsersList, initialRole = 'user' }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState(initialRole || 'user'); // 'user' or 'admin'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleModeSwitch = (toLogin) => {
    setIsLoginMode(toLogin);
    if (!toLogin) {
      setSelectedRole('user');
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const applyDemoCredentials = (role) => {
    if (role === 'admin') {
      setAuthEmail('admin@scamradar.com');
      setAuthPassword('admin123');
      setSelectedRole('admin');
    } else {
      setAuthEmail('user@enterprise.com');
      setAuthPassword('user123');
      setSelectedRole('user');
    }
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = authEmail.trim().toLowerCase();
    const cleanPassword = authPassword.trim();
    const cleanName = authName.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (isLoginMode) {
      // 1. If System Admin tab is selected
      if (selectedRole === 'admin') {
        if (cleanEmail !== 'admin@scamradar.com') {
          setErrorMessage('Access Denied: Only the designated System Administrator (admin@scamradar.com) can access the Admin Portal.');
          return;
        }
        if (cleanPassword !== 'admin123') {
          setErrorMessage('Invalid administrator password. Access denied.');
          return;
        }
        const adminObj = { email: 'admin@scamradar.com', name: 'System Administrator', role: 'admin' };
        setCurrentUser(adminObj);
        localStorage.setItem('scamradar_user', JSON.stringify(adminObj));
        onClose();
        return;
      }

      // 2. If user enters admin credentials on the regular tab
      if (cleanEmail === 'admin@scamradar.com') {
        if (cleanPassword === 'admin123') {
          const adminObj = { email: 'admin@scamradar.com', name: 'System Administrator', role: 'admin' };
          setCurrentUser(adminObj);
          localStorage.setItem('scamradar_user', JSON.stringify(adminObj));
          onClose();
          return;
        } else {
          setErrorMessage('Invalid administrator password.');
          return;
        }
      }

      // 3. Regular User Login via Backend
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
        });
        const textData = await res.text();
        let data = {};
        try {
          data = textData ? JSON.parse(textData) : {};
        } catch (pe) {
          // Fallback to local parsing
        }

        if (!res.ok) {
          throw new Error(data.detail || 'Invalid email or password.');
        }

        // All non-admin accounts strictly get role: 'user'
        const userObj = {
          email: cleanEmail,
          name: data.user?.name || 'Enterprise User',
          role: 'user'
        };

        setCurrentUser(userObj);
        localStorage.setItem('scamradar_user', JSON.stringify(userObj));
        onClose();
      } catch (err) {
        // Fallback login check against registered users array in localStorage
        const existingUser = usersList.find(u => u.email.toLowerCase() === cleanEmail);
        if (!existingUser) {
          if (cleanEmail === 'user@enterprise.com' && cleanPassword === 'user123') {
            const userObj = { email: cleanEmail, name: 'Enterprise User', role: 'user' };
            setCurrentUser(userObj);
            localStorage.setItem('scamradar_user', JSON.stringify(userObj));
            onClose();
            return;
          }
          setErrorMessage('User not found. Please verify your email or register a new account.');
          return;
        }

        if (existingUser.password !== cleanPassword) {
          setErrorMessage('Invalid credentials. The password you entered is incorrect.');
          return;
        }

        const userObj = { 
          email: existingUser.email, 
          name: existingUser.name || 'User', 
          role: 'user' 
        };
        setCurrentUser(userObj);
        localStorage.setItem('scamradar_user', JSON.stringify(userObj));
        onClose();
      }
    } else {
      // Registration Logic - strictly regular User accounts only
      if (!cleanName) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      if (cleanEmail === 'admin@scamradar.com') {
        setErrorMessage('The email admin@scamradar.com is reserved. Administrator accounts cannot be registered publicly.');
        return;
      }

      const passwordError = validatePassword(cleanPassword);
      if (passwordError) {
        setErrorMessage(passwordError);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: cleanName || 'ScamRadar User', 
            email: cleanEmail, 
            password: cleanPassword, 
            role: 'user' 
          })
        });
        const textData = await res.text();
        const data = textData ? JSON.parse(textData) : {};

        if (!res.ok) {
          throw new Error(data.detail || 'Registration failed. Email may already exist.');
        }

        const newUser = { 
          email: cleanEmail, 
          password: cleanPassword, 
          name: cleanName || 'ScamRadar User', 
          role: 'user' 
        };
        const updatedList = [...usersList.filter(u => u.email.toLowerCase() !== cleanEmail), newUser];
        setUsersList(updatedList);
        localStorage.setItem('scamradar_registered_users', JSON.stringify(updatedList));

        setSuccessMessage('Account created successfully! You can now sign in.');
        setIsLoginMode(true);
        setSelectedRole('user');
        setAuthPassword('');
      } catch (err) {
        const emailExists = usersList.some(u => u.email.toLowerCase() === cleanEmail);
        if (emailExists) {
          setErrorMessage('This email address is already registered in our system.');
          return;
        }
        const newUser = { 
          email: cleanEmail, 
          password: cleanPassword, 
          name: cleanName || 'ScamRadar User', 
          role: 'user' 
        };
        const updatedList = [...usersList.filter(u => u.email.toLowerCase() !== cleanEmail), newUser];
        setUsersList(updatedList);
        localStorage.setItem('scamradar_registered_users', JSON.stringify(updatedList));

        setSuccessMessage('Account registered successfully! You can now sign in.');
        setIsLoginMode(true);
        setSelectedRole('user');
        setAuthPassword('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-panelbg border border-gray-800 rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md max-h-[92vh] overflow-y-auto relative text-left font-sans">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-500 hover:text-white transition cursor-pointer p-1"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        
        {/* Modal Title & Subtitle */}
        <div className="mb-5">
          <div className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase mb-1">
            {isLoginMode ? 'AUTHENTICATION PORTAL' : 'NEW REGISTRATION'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isLoginMode ? 'Welcome to ScamRadar' : 'Create Your Account'}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {isLoginMode 
              ? 'Select your role and sign in to access threat defense modules.' 
              : 'Choose your access level to join ScamRadar threat intelligence.'}
          </p>
        </div>

        {/* ROLE SELECTION TABS - Only displayed in Login Mode */}
        {isLoginMode ? (
          <div className="mb-5">
            <label className="block text-[11px] font-mono uppercase tracking-wider font-bold text-gray-400 mb-2">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-darkbg p-1.5 rounded-xl border border-gray-800">
              {/* User Role Button */}
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'user'
                    ? 'bg-accent text-darkbg shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <i className="fa-solid fa-user text-xs"></i>
                <span>Regular User</span>
              </button>

              {/* Admin Role Button */}
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-danger text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <i className="fa-solid fa-shield-halved text-xs"></i>
                <span>System Admin</span>
              </button>
            </div>

            {/* Role Description Notice */}
            <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
              <i className={`fa-solid ${selectedRole === 'admin' ? 'fa-triangle-exclamation text-danger' : 'fa-circle-info text-accent'}`}></i>
              <span>
                {selectedRole === 'admin' 
                  ? 'Admin: Authorized administrative credentials required.' 
                  : 'User: Upload evidence, run AI scans, and track personal cases.'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-5 p-3.5 bg-darkbg/80 border border-gray-800 rounded-xl flex items-center gap-2.5 text-xs text-gray-300">
            <i className="fa-solid fa-user-shield text-accent text-sm shrink-0"></i>
            <span>Registering for a <strong>Standard User Account</strong>. Administrator accounts are pre-provisioned and cannot be registered publicly.</span>
          </div>
        )}

        {/* Alerts */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
            <i className="fa-solid fa-circle-check text-emerald-400 text-base shrink-0"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-xl text-danger text-xs flex items-center gap-2.5">
            <i className="fa-solid fa-triangle-exclamation text-danger text-base shrink-0"></i>
            <span>{errorMessage}</span>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={authName} 
                onChange={e => setAuthName(e.target.value)} 
                placeholder="Jane Doe" 
                className="w-full bg-darkbg border border-gray-700/80 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-accent transition" 
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={authEmail} 
              onChange={e => setAuthEmail(e.target.value)} 
              placeholder={isLoginMode && selectedRole === 'admin' ? "admin@scamradar.com" : "user@enterprise.com"} 
              className="w-full bg-darkbg border border-gray-700/80 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-accent transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={authPassword} 
              onChange={e => setAuthPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full bg-darkbg border border-gray-700/80 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-accent transition" 
            />
            {!isLoginMode && (
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <i className="fa-solid fa-circle-info text-accent text-[10px]"></i>
                <span>At least 6 characters with both letters &amp; numbers</span>
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`w-full font-extrabold py-3.5 rounded-xl shadow-lg transition mt-4 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
              isLoginMode && selectedRole === 'admin'
                ? 'bg-danger hover:bg-red-600 text-white shadow-danger/30'
                : 'bg-accent hover:bg-accenthover text-darkbg shadow-accent/30'
            }`}
          >
            <i className={`fa-solid ${isLoginMode ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}`}></i>
            <span>{isLoginMode ? (selectedRole === 'admin' ? 'Sign In as System Admin' : 'Sign In as Regular User') : 'Register Account'}</span>
          </button>
        </form>
        
        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-gray-400 border-t border-gray-800/80 pt-3.5">
          <span>{isLoginMode ? "Don't have an account?" : "Already registered?"}</span> 
          <button 
            type="button"
            onClick={() => handleModeSwitch(!isLoginMode)} 
            className="text-accent hover:underline font-bold transition ml-1.5 cursor-pointer"
          >
            {isLoginMode ? "Register here" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
