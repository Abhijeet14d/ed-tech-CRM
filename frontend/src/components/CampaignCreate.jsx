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
  const [nlpEnabled, setNlpEnabled] = useState(false);
  const [nlQuery, setNlQuery] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);

  const handlePreview = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/students/segment-preview`, { logic, rules }, { withCredentials: true });
      setPreview(res.data.count);
    } catch (err) {
      setPreview("Error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/campaigns`, {
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

  const handleParseNaturalLanguage = async () => {
    setNlpLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/students/parse-nl`, { query: nlQuery }, { withCredentials: true });
      setRules(res.data.rules);
      setLogic(res.data.logic || "AND");
      setStatus("Parsed rules from description.");
    } catch (err) {
      setStatus("Error: Could not parse the description. Try rephrasing.");
    } finally {
      setNlpLoading(false);
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

          {/* NLP Toggle */}
          <div className="flex items-center mb-2">
            <label className="mr-3 font-medium text-gray-700">NLP Segment Builder</label>
            <button
              type="button"
              onClick={() => setNlpEnabled(v => !v)}
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${nlpEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${nlpEnabled ? 'translate-x-6' : ''}`}></div>
            </button>
            <span className="ml-2 text-sm text-gray-500">{nlpEnabled ? 'ON' : 'OFF'}</span>
          </div>

          {/* Segment Rules or NLP Input */}
          {nlpEnabled ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your target segment (in plain English)
              </label>
              <input
                type="text"
                value={nlQuery}
                onChange={e => setNlQuery(e.target.value)}
                placeholder='e.g., "students with CGPA above 8 and age below 22"'
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleParseNaturalLanguage}
                disabled={nlpLoading || !nlQuery}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {nlpLoading ? 'Parsing...' : 'Parse to Rules'}
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Segment Rules
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <RuleBuilder rules={rules} setRules={setRules} logic={logic} setLogic={setLogic} />
              </div>
            </div>
          )}

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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              <span>Launch Campaign</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignCreate;