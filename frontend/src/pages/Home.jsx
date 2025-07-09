import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Home</h1>
        {user ? (
          <div className="flex flex-col items-center">
            <img
              src={user.photo}
              alt="profile"
              width={50}
              className="rounded-full mb-4 border-2 border-blue-500"
            />
            <p className="text-lg font-medium mb-4">Welcome, <span className="text-blue-600">{user.displayName}</span></p>
            <a
              href="http://localhost:3000/auth/logout"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Logout
            </a>
          </div>
        ) : (
          <p className="text-center">
            Please{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              login
            </a>.
          </p>
        )}
      </div>
    </div>
  )
}

export default Home