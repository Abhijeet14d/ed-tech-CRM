import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RuleBuilder from "./RuleBuilder";

const CampaignCreate = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState([{ field: "age", operator: ">", value: "", connector: "AND" }]);
  const [status, setStatus] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [builderMode, setBuilderMode] = useState("sql"); // "sql" or "nlp"
  const [nlQuery, setNlQuery] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/students/segment-preview`, 
        { rules }, 
        { withCredentials: true }
      );
      setStudentCount(res.data.count);
      setSelectedStudents(res.data.students || []);
    } catch (err) {
      setStatus("Error: Could not fetch students");
      setSelectedStudents([]);
      setStudentCount(0);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (studentCount === 0) {
      setStatus("Error: Please select at least one student using the segment builder");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/campaigns`, {
        title,
        message,
        segment: { rules },
        createdBy: user?._id
      }, { withCredentials: true });
      setStatus("Campaign created successfully!");
      setTitle(""); 
      setMessage(""); 
      setRules([{ field: "age", operator: ">", value: "", connector: "AND" }]);
      setSelectedStudents([]);
      setStudentCount(0);
      setNlQuery("");
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const handleParseNaturalLanguage = async () => {
    setNlpLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/students/parse-nl`, 
        { query: nlQuery }, 
        { withCredentials: true }
      );
      // Convert old format to new per-rule connector format
      const parsedRules = res.data.rules.map((rule, idx) => ({
        ...rule,
        connector: idx === 0 ? "AND" : (res.data.logic || "AND")
      }));
      setRules(parsedRules);
      setStatus("Rules parsed from description. Click 'Find Students' to see results.");
    } catch (err) {
      setStatus("Error: Could not parse the description. Try rephrasing.");
    } finally {
      setNlpLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        <p className="text-gray-600 mt-1">Design targeted campaigns for student engagement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Box 1: Campaign Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            Campaign Details
          </h2>
          
          <div className="space-y-4">
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
                Tip: Use <code className="bg-gray-100 px-1 rounded">{"{name}"}</code> in your message to personalize it for each student
              </p>
            </div>
          </div>
        </div>

        {/* Box 2: Segment Builder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
              Select Target Students
            </h2>
            
            {/* Toggle Button */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setBuilderMode("sql")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  builderMode === "sql" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Rule Builder
              </button>
              <button
                type="button"
                onClick={() => setBuilderMode("nlp")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  builderMode === "nlp" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Natural Language
              </button>
            </div>
          </div>

          {/* SQL Builder Mode */}
          {builderMode === "sql" && (
            <div className="bg-gray-50 rounded-lg p-4">
              <RuleBuilder rules={rules} setRules={setRules} />
            </div>
          )}

          {/* NLP Builder Mode */}
          {builderMode === "nlp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your target audience in plain English
                </label>
                <input
                  type="text"
                  value={nlQuery}
                  onChange={e => setNlQuery(e.target.value)}
                  placeholder='e.g., "students with CGPA above 8 and age below 22"'
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleParseNaturalLanguage}
                disabled={nlpLoading || !nlQuery}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                {nlpLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Parsing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Convert to Rules</span>
                  </>
                )}
              </button>

              {/* Show converted rules */}
              {rules.length > 0 && rules[0].value && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Generated Rules:</p>
                  <div className="text-sm text-blue-700">
                    {rules.map((rule, idx) => (
                      <span key={idx}>
                        {idx > 0 && <span className="mx-1 font-medium">{rule.connector}</span>}
                        <span className="bg-blue-100 px-2 py-1 rounded">{rule.field} {rule.operator} {rule.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Find Students Button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePreview}
              disabled={previewLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              {previewLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Finding Students...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Find Students</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Box 3: Selected Students */}
        {studentCount > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
                Selected Students
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {studentCount} student{studentCount !== 1 ? 's' : ''} selected
              </span>
            </h2>
            
            <div className="max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedStudents.map((student) => (
                  <div 
                    key={student._id} 
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {student.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500 truncate">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              {studentCount > selectedStudents.length && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Showing {selectedStudents.length} of {studentCount} students
                </p>
              )}
            </div>
          </div>
        )}

        {/* Status Message */}
        {status && (
          <div className={`px-4 py-3 rounded-lg ${
            status.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {status}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={studentCount === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Launch Campaign</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignCreate;