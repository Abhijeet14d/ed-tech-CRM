import React, { useState, useEffect } from "react";
import axios from "axios";

const BulkStudentUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // Fetch students with pagination
  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/students?page=${page}&limit=20`, {
        withCredentials: true,
      });
      setStudents(response.data.students);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    
    setDeleting(studentId);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/students/${studentId}`, {
        withCredentials: true,
      });
      // Refresh the current page
      fetchStudents(currentPage);
      setMessage("✅ Student deleted successfully!");
    } catch (error) {
      setMessage("❌ Failed to delete student: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setDeleting(null);
    }
  };

  // Delete all students
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL students? This action cannot be undone!")) {
      return;
    }
    
    setDeletingAll(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/students/`, {
        withCredentials: true,
      });
      setMessage(`✅ All students deleted successfully! (${response.data.deletedCount} records removed)`);
      // Reset to first page and refresh
      setCurrentPage(1);
      fetchStudents(1);
    } catch (error) {
      setMessage("❌ Failed to delete all students: " + (error.response?.data?.error || "Unknown error"));
    } finally {
      setDeletingAll(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file.");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/students/bulk-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage(`✅ Upload successful! ${response.data.count} students added.`);
      setFile(null);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      // Refresh students list
      fetchStudents(currentPage);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bulk Student Upload</h1>
          <p className="text-gray-600 mt-1">Upload multiple students using CSV or Excel files</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">📋 File Format Requirements:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Supported formats: CSV (.csv) or Excel (.xlsx)</li>
            <li>• Required columns: <b>name, age, email, cgpa, courseName</b></li>
            <li>• Maximum 200 records per upload</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <div className="space-y-2">
                <div className="text-4xl text-gray-400">📁</div>
                <div>
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected: <span className="font-medium">{file.name}</span>
                  </p>
                )}
              </div>
            </div>
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
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>Upload Students</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Student Data Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Student Records</h2>
            <p className="text-sm text-gray-600">
              Total: {pagination.totalStudents || 0} students
            </p>
          </div>
          {students.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              {deletingAll ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Deleting All...</span>
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  <span>Delete All Records</span>
                </>
              )}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-500">No students found. Upload some students to get started!</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">CGPA</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{student.name}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{student.age}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{student.email}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{student.cgpa}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{student.courseName}</td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(student._id)}
                          disabled={deleting === student._id}
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 mx-auto"
                        >
                          {deleting === student._id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <span>🗑️</span>
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchStudents(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isCurrentPage = pageNum === pagination.currentPage;
                      
                      // Show first 2, last 2, and pages around current
                      const showPage = 
                        pageNum <= 2 ||
                        pageNum > pagination.totalPages - 2 ||
                        Math.abs(pageNum - pagination.currentPage) <= 1;
                      
                      if (!showPage) {
                        // Show ellipsis
                        if (pageNum === 3 && pagination.currentPage > 4) {
                          return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                        }
                        if (pageNum === pagination.totalPages - 2 && pagination.currentPage < pagination.totalPages - 3) {
                          return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchStudents(pageNum)}
                          className={`px-3 py-1 text-sm rounded ${
                            isCurrentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => fetchStudents(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BulkStudentUpload;