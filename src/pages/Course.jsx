import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createCourse,
  getAllCourses,
  editCourse,
  deleteCourse,
  updateCourseStatus,
} from "../services/api";

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const COURSE_TYPES = ["academic", "non-academic"];

export default function Course() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: "",
    courseType: "",
    courseDescription: "",
    thumbnail: null,
    difficulty: "",
    price: "",
    deadline: "",
    courseDuration: "",
    // Academic fields
    board: "",
    medium: "",
    classname: "",
    subject: "",
    stream: "",
    // Non-academic fields
    category: "",
    subcategory: "",
    targetAudience: "",
    totalLessons: "",
  });
  const [updatingId, setUpdatingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [filterStatus, filterType, filterDifficulty]);

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.courseType = filterType;
      if (filterDifficulty) params.difficulty = filterDifficulty;
      const response = await getAllCourses(params);
      let filteredCourses = response.data || [];

      // Client-side search filtering
      if (searchTerm) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.courseName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.courseCode
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.courseDescription
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }

      setCourses(filteredCourses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setFormData({
      courseName: "",
      courseType: "",
      courseDescription: "",
      thumbnail: null,
      difficulty: "",
      price: "",
      deadline: "",
      courseDuration: "",
      // Academic fields
      board: "",
      medium: "",
      classname: "",
      subject: "",
      stream: "",
      // Non-academic fields
      category: "",
      subcategory: "",
      targetAudience: "",
      totalLessons: "",
    });
    setFieldErrors({});
    setIsPopupOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      courseType: course.courseType,
      courseDescription: course.courseDescription || "",
      thumbnail: null, // Reset to null for file input
      difficulty: course.difficulty,
      price: course.price || "",
      deadline: course.deadline ? course.deadline.split('T')[0] : "",
      courseDuration: course.courseDuration || "",
      // Academic fields
      board: course.board || "",
      medium: course.medium || "",
      classname: course.classname || "",
      subject: course.subject || "",
      stream: course.stream || "",
      // Non-academic fields
      category: course.category || "",
      subcategory: course.subcategory || "",
      targetAudience: course.targetAudience || "",
      totalLessons: course.totalLessons || "",
    });
    setIsPopupOpen(true);
  };

  const handleDeleteCourse = async (courseCode) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setFullScreenLoading(true);
      try {
        await deleteCourse(courseCode);
        setCourses(courses.filter((c) => c.courseCode !== courseCode));
        toast.success("Course deleted successfully!");
      } catch (err) {
        console.error("Failed to delete course:", err);
        toast.error("Failed to delete course. Please try again.");
      } finally {
        setFullScreenLoading(false);
      }
    }
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.courseName) errors.courseName = true;
    if (!formData.courseType) errors.courseType = true;
    if (!formData.courseDescription) errors.courseDescription = true;
    if (!formData.difficulty) errors.difficulty = true;
    if (!formData.deadline) errors.deadline = true;
    if (!formData.courseDuration) errors.courseDuration = true;

    // Validation for academic courses
    if (formData.courseType === "academic") {
      if (!formData.classname) errors.classname = true;
      if (!formData.subject) errors.subject = true;
    }

    // Validation for non-academic courses
    if (formData.courseType === "non-academic") {
      if (!formData.category) errors.category = true;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fill all required fields");
      return;
    }

    setFieldErrors({});

    setSavingLoading(true);
    setFullScreenLoading(true);
    try {
      if (editingCourse) {
        await editCourse(editingCourse.courseCode, formData);
        setCourses(
          courses.map((c) =>
            c.courseCode === editingCourse.courseCode ? { ...c, ...formData } : c,
          ),
        );
        toast.success("Course updated successfully!");
      } else {
        const response = await createCourse(formData);
        setCourses([response.data, ...courses]);
        toast.success("Course created successfully!");
      }
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Failed to save course:", err);
      toast.error("Failed to save course. Please try again.");
    } finally {
      setSavingLoading(false);
      setFullScreenLoading(false);
    }
  };

  const handleStatusChange = async (course, newStatus) => {
    if (course.status === newStatus) return;

    setFullScreenLoading(true);
    try {
      setUpdatingId(course.courseCode);
      await updateCourseStatus(course.courseCode, newStatus);
      setCourses((prev) =>
        prev.map((c) =>
          c.courseCode === course.courseCode ? { ...c, status: newStatus } : c,
        ),
      );
      toast.success(`Course set to ${newStatus}`);
      setOpenMenuId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
      setFullScreenLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingCourse(null);
    setFormData({
      courseName: "",
      courseType: "",
      courseDescription: "",
      thumbnailUrl: "",
      difficulty: "",
      price: "",
      deadline: "",
      courseDuration: "",
      board: "",
      medium: "",
      classname: "",
      subject: "",
      stream: "",
      category: "",
      subcategory: "",
      targetAudience: "",
      totalLessons: "",
    });
  };

  const handleSearch = () => {
    fetchCourses();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500 hover:bg-green-600";
      case "Rejected":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Courses</h1>
        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search by name, code, or description..."
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="academic">Academic</option>
              <option value="non-academic">Non-Academic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Levels</option>
              {DIFFICULTY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="text-center py-10">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No courses found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/course/profile/${course.courseCode}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.courseName}
                    </div>
                    {course.courseDescription && (
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {course.courseDescription}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.courseCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.courseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.difficulty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.price ? `₹${course.price}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === course.courseCode ? null : course.courseCode,
                          );
                        }}
                        className={`px-3 py-1 text-sm border rounded text-white flex items-center gap-1 ${getStatusColor(
                          course.status
                        )}`}
                      >
                        <Edit className="w-3 h-3" />
                        {course.status}
                      </button>

                      {openMenuId === course.courseCode && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-50">
                          <button
                            disabled={updatingId === course.courseCode}
                            onClick={() => handleStatusChange(course, "Active")}
                            className={`w-full px-4 py-2 text-left text-sm ${
                              course.status === "Active"
                                ? "bg-green-50 text-green-700 font-semibold"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            Activate
                          </button>
                          <button
                            disabled={updatingId === course.courseCode}
                            onClick={() => handleStatusChange(course, "Pending")}
                            className={`w-full px-4 py-2 text-left text-sm ${
                              course.status === "Pending"
                                ? "bg-yellow-50 text-yellow-700 font-semibold"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            disabled={updatingId === course.courseCode}
                            onClick={() => handleStatusChange(course, "Rejected")}
                            className={`w-full px-4 py-2 text-left text-sm ${
                              course.status === "Rejected"
                                ? "bg-red-50 text-red-700 font-semibold"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.courseCode);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingCourse ? "Edit Course" : "Add Course"}
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({ ...formData, courseName: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${fieldErrors.courseName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter course name"
                  />
                  {fieldErrors.courseName && (
                    <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Type *
                  </label>
                  <select
                    value={formData.courseType}
                    onChange={(e) =>
                      setFormData({ ...formData, courseType: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${fieldErrors.courseType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select Type</option>
                    {COURSE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.courseType && (
                    <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${fieldErrors.difficulty ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select Difficulty</option>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.difficulty && (
                    <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.files[0] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.thumbnail && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {formData.thumbnail.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline Of Course*
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${fieldErrors.deadline ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {fieldErrors.deadline && (
                    <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Duration for student*
                  </label>
                  <input
                    type="number"
                    value={formData.courseDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, courseDuration: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${fieldErrors.courseDuration ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {fieldErrors.courseDuration && (
                    <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                  )}
                </div>
                      

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Lessons
                  </label>
                  <input
                    type="number"
                    value={formData.totalLessons}
                    onChange={(e) =>
                      setFormData({ ...formData, totalLessons: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter total lessons"
                    min="0"
                  />
                </div>
              </div>

              {/* Academic Fields */}
              {formData.courseType === "academic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                  <h3 className="col-span-full text-md font-medium text-gray-800">
                    Academic Course Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Board *
                    </label>
                    <input
                      type="text"
                      value={formData.board}
                      onChange={(e) =>
                        setFormData({ ...formData, board: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter board"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medium
                    </label>
                    <input
                      type="text"
                      value={formData.medium}
                      onChange={(e) =>
                        setFormData({ ...formData, medium: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Level *
                    </label>
                    <input
                      type="text"
                      value={formData.classname}
                      onChange={(e) =>
                        setFormData({ ...formData, classname: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${fieldErrors.classname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter class level"
                    />
                    {fieldErrors.classname && (
                      <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${fieldErrors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter subject"
                    />
                    {fieldErrors.courseDescription && (
                  <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stream
                    </label>
                    <input
                      type="text"
                      value={formData.stream}
                      onChange={(e) =>
                        setFormData({ ...formData, stream: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter stream"
                    />
                  </div>
                </div>
              )}

              {/* Non-Academic Fields */}
              {formData.courseType === "non-academic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                  <h3 className="col-span-full text-md font-medium text-gray-800">
                    Non-Academic Course Details
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${fieldErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter category"
                    />
                    {fieldErrors.category && (
                      <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) =>
                        setFormData({ ...formData, subcategory: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter subcategory"
                    />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({ ...formData, targetAudience: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter target audience"
                    />
                  </div>
                </div>
              )}

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Description *
                </label>
                <textarea
                  value={formData.courseDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseDescription: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border ${fieldErrors.courseDescription ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter course description"
                  rows="4"
                />
                {fieldErrors.courseDescription && (
                  <p className="text-red-500 text-xs mt-1">Please fill this field, this field is required</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={savingLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {savingLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Loading Overlay */}
      {fullScreenLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
