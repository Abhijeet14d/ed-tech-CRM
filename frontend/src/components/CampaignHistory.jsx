import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/campaigns`, { withCredentials: true })
      .then(res => {
        setCampaigns(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campaigns:', err);
        setLoading(false);
      });
  }, []);

  const formatSegmentRules = (segment) => {
    if (!segment || !segment.rules) return 'No rules defined';
    
    return segment.rules.map(rule => 
      `${rule.field} ${rule.operator} ${rule.value}`
    ).join(` ${segment.logic} `);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campaign History</h1>
              <p className="text-gray-600 mt-1">View all your past campaigns and their performance</p>
            </div>
            <Link
              to="/create-campaign"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Campaign</span>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first campaign</p>
              <Link
                to="/create-campaign"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Campaign
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{campaign.message}</p>
                      <div className="text-sm text-gray-500 mb-3">
                        <span className="font-medium">Target Rules:</span> {formatSegmentRules(campaign.segment)}
                      </div>
                      
                      {/* Creator Info */}
                      {campaign.createdBy && (
                        <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                          <img 
                            src={campaign.createdBy.photo} 
                            alt={campaign.createdBy.displayName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-500">
                            Created by <span className="font-medium text-gray-700">{campaign.createdBy.displayName}</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{new Date(campaign.createdAt).toLocaleDateString()}</div>
                      <div>{new Date(campaign.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignHistory;