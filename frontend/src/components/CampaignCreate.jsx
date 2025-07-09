import React, { useState } from "react";
import axios from "axios";
import RuleBuilder from "./RuleBuilder";

const CampaignCreate = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState([{ field: "age", operator: "<", value: "" }]);
  const [logic, setLogic] = useState("AND");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);

  const handlePreview = async () => {
    try {
      const res = await axios.post("http://localhost:3000/students/segment-preview", { logic, rules }, { withCredentials: true });
      setPreview(res.data.count);
    } catch (err) {
      setPreview("Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/campaigns", {
        title,
        message,
        segment: { logic, rules }
      }, { withCredentials: true });
      setStatus("Campaign created!");
      setTitle(""); setMessage(""); setRules([{ field: "age", operator: "<", value: "" }]);
      setPreview(null);
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-1">Design targeted campaigns for student engagement</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title
              </label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter campaign title" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience Preview
              </label>
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  onClick={handlePreview} 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Preview Segment
                </button>
                {preview !== null && (
                  <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                    <span className="font-medium">{preview}</span> students targeted
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Message
            </label>
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Write your campaign message here... Use {name} to personalize" 
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
            <p className="text-sm text-gray-500 mt-1">
              Tip: Use {"{name}"} in your message to personalize it for each student
            </p>
          </div>

          {/* Segment Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Segment Rules
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <RuleBuilder rules={rules} setRules={setRules} logic={logic} setLogic={setLogic} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {status && (
                <div className={`px-4 py-2 rounded-lg ${
                  status.includes('Error') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {status}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              🚀 Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignCreate;