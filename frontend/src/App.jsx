import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import StudentProfileUpload from './components/StudentProfileUpload.jsx';
import BulkStudentUpload from './components/BulkStudentUpload.jsx';
import CampaignCreate from './components/CampaignCreate';
import CampaignHistory from './components/CampaignHistory';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/upload-profile" element={
          <ProtectedRoute>
            <Layout>
              <StudentProfileUpload />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/bulk-upload" element={
          <ProtectedRoute>
            <Layout>
              <BulkStudentUpload />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/create-campaign" element={
          <ProtectedRoute>
            <Layout>
              <CampaignCreate />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/campaign-history" element={
          <ProtectedRoute>
            <Layout>
              <CampaignHistory />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App