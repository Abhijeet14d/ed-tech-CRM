import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    axios.get('http://localhost:3000/auth/me', { withCredentials: true })
      .then(res => {
        if (res.data) {
          navigate('/'); // Redirect to dashboard if already logged in
        }
      })
      .catch(() => {
        // User not logged in, stay on login page
      });
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md flex flex-col items-center">
        <img
          src="https://img.icons8.com/color/96/000000/graduation-cap.png"
          alt="Mini Ed Tech Campaign Platform"
          className="mb-4"
        />
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
          Mini Ed Tech Campaign Platform
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Welcome! Please sign in to manage your campaigns.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 bg-white border border-gray-300 hover:bg-blue-50 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow transition duration-200 w-full justify-center"
        >
          <img
            src="https://img.icons8.com/color/24/000000/google-logo.png"
            alt="Google"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;