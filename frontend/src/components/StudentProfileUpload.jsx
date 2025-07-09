import React, { useState } from "react";
import axios from "axios";

const StudentProfileUpload = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    cgpa: "",
    courseName: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/students/profile",
        {
          ...form,
          age: Number(form.age),
          cgpa: Number(form.cgpa),
        },
        { withCredentials: true }
      );
      setMessage("Student profile uploaded!");
      setForm({ name: "", age: "", email: "", cgpa: "", courseName: "" });
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Student Profile</h1>
          <p className="text-gray-600 mt-1">Add individual student information to your database</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name
              </label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter student name" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input 
                name="age" 
                value={form.age} 
                onChange={handleChange} 
                placeholder="Enter age" 
                type="number" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Enter email address" 
              type="email" 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CGPA
              </label>
              <input 
                name="cgpa" 
                value={form.cgpa} 
                onChange={handleChange} 
                placeholder="Enter CGPA" 
                type="number" 
                step="0.01"
                min="0"
                max="10"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input 
                name="courseName" 
                value={form.courseName} 
                onChange={handleChange} 
                placeholder="e.g., Mathematics, Physics" 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                required 
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {message && (
                <div className={`px-4 py-2 rounded-lg ${
                  message.includes('Error') 
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
              ➕ Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileUpload;