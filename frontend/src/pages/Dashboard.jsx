import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCampaigns: 0,
    recentCampaigns: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, campaignsRes] = await Promise.all([
          axios.get('http://localhost:3000/students/stats', { withCredentials: true }),
          axios.get('http://localhost:3000/campaigns', { withCredentials: true })
        ]);
        
        setStats({
          totalStudents: studentsRes.data.total || 0,
          totalCampaigns: campaignsRes.data.length || 0,
          recentCampaigns: campaignsRes.data.slice(0, 3) || []
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add Student',
      description: 'Add a single student profile',
      icon: '👤',
      link: '/upload-profile',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Bulk Upload',
      description: 'Upload multiple students via CSV/Excel',
      icon: '📁',
      link: '/bulk-upload',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Create Campaign',
      description: 'Create a new marketing campaign',
      icon: '🚀',
      link: '/create-campaign',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Campaign History',
      description: 'View all past campaigns',
      icon: '📋',
      link: '/campaign-history',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to EdTech CRM Dashboard</h1>
        <p className="text-blue-100">Manage your student campaigns and engagement effectively</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.link}
              to={action.link}
              className={`${action.color} text-white rounded-lg p-4 transition-all duration-200 transform hover:scale-105 shadow-md`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{action.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Campaigns</h2>
          <Link 
            to="/campaign-history" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        {stats.recentCampaigns.length > 0 ? (
          <div className="space-y-3">
            {stats.recentCampaigns.map((campaign) => (
              <div key={campaign._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{campaign.message.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500">No campaigns yet. Create your first campaign!</p>
            <Link
              to="/create-campaign"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
