import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/api";
import { toast } from "react-toastify";

export default function CourseProfile() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await getCourseById(id);
      setCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Course Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-start gap-4">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.courseName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{course.courseName}</h2>
                <p className="text-sm text-gray-500">Code: {course.courseCode}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.status}
                  </span>
                  <span className="text-sm text-gray-600">{course.courseType}</span>
                  <span className="text-sm text-gray-600">{course.difficulty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm text-gray-800">{course.courseDescription}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Price</label>
                  <p className="text-sm text-gray-800">${course.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Total Lessons</label>
                  <p className="text-sm text-gray-800">{course.totalLessons}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Deadline</label>
                  <p className="text-sm text-gray-800">
                    {course.deadline ? new Date(course.deadline).toLocaleDateString() : 'No deadline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic/Non-Academic Specific */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {course.courseType === 'academic' ? 'Academic Details' : 'Non-Academic Details'}
              </h3>
              <div className="space-y-3">
                {course.courseType === 'academic' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Board</label>
                      <p className="text-sm text-gray-800">{course.board || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Medium</label>
                      <p className="text-sm text-gray-800">{course.medium || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Class</label>
                      <p className="text-sm text-gray-800">{course.classname || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Subject</label>
                      <p className="text-sm text-gray-800">{course.subject || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Stream</label>
                      <p className="text-sm text-gray-800">{course.stream || 'N/A'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Category</label>
                      <p className="text-sm text-gray-800">{course.category || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Subcategory</label>
                      <p className="text-sm text-gray-800">{course.subcategory || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Target Audience</label>
                      <p className="text-sm text-gray-800">{course.targetAudience || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span> {new Date(course.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {new Date(course.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
