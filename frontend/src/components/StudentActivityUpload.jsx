import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentActivityUpload = () => {
  const [form, setForm] = useState({
    student: "",
    course: "",
    progress: "",
    quizScore: "",
    loginFrequency: "",
    lastActive: "",
  });
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students for dropdown
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/students/list', { withCredentials: true });
        setStudents(response.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/students/activity",
        {
          ...form,
          progress: Number(form.progress),
          quizScore: Number(form.quizScore),
          loginFrequency: Number(form.loginFrequency),
        },
        { withCredentials: true }
      );
      setMessage("✅ Student activity uploaded successfully!");
      setForm({ student: "", course: "", progress: "", quizScore: "", loginFrequency: "", lastActive: "" });
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Student Activity</h1>
          <p className="text-gray-600 mt-1">Record student course progress and engagement data</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student
              </label>
              <select
                name="student"
                value={form.student}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress (%)
              </label>
              <input
                name="progress"
                value={form.progress}
                onChange={handleChange}
                placeholder="0-100"
                type="number"
                min="0"
                max="100"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Score
              </label>
              <input
                name="quizScore"
                value={form.quizScore}
                onChange={handleChange}
                placeholder="0-100"
                type="number"
                min="0"
                max="100"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login Frequency (per week)
              </label>
              <input
                name="loginFrequency"
                value={form.loginFrequency}
                onChange={handleChange}
                placeholder="e.g., 5"
                type="number"
                min="0"
                max="7"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Active Date
            </label>
            <input
              name="lastActive"
              value={form.lastActive}
              onChange={handleChange}
              type="date"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {message && (
                <div className={`px-4 py-2 rounded-lg ${
                  message.includes('❌') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {message}
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              📊 Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentActivityUpload;