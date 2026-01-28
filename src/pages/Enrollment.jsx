import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2, Search } from "lucide-react";
import { toast } from "react-toastify";
import {
  createEnrollment,
  getAllEnrollments,
  updateEnrollment,
  deleteEnrollment,
  getStudents,
  getAllCourses,
} from "../services/api";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];
const PAYMENT_STATUS_OPTIONS = ["UNPAID", "PAID", "FAILED", "REFUNDED"];

export default function Enrollment() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    status: "PENDING",
    paymentStatus: "UNPAID",
    remarks: "",
    transactionNumber: "",
    orderId: "",
    paymentMethod: "",
    amountPaid: "",
    currency: "INR",
  });
  const [updatingId, setUpdatingId] = useState(null);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [filterStatus, filterPaymentStatus]);

  useEffect(() => {
    fetchEnrollments();
  }, [searchTerm]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPaymentStatus) params.paymentStatus = filterPaymentStatus;
      const response = await getAllEnrollments(params);
      let filteredEnrollments = response.data || [];

      // Client-side search filtering
      if (searchTerm) {
        filteredEnrollments = filteredEnrollments.filter(
          (enrollment) =>
            enrollment.enrollmentCode
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            enrollment.studentName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            enrollment.courseName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        );
      }

      setEnrollments(filteredEnrollments);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setCourses([]);
    }
  };

  const handleAddEnrollment = () => {
    setEditingEnrollment(null);
    setFormData({
      studentId: "",
      courseId: "",
      status: "PENDING",
      paymentStatus: "UNPAID",
      remarks: "",
      transactionNumber: "",
      orderId: "",
      paymentMethod: "",
      amountPaid: "",
      currency: "INR",
    });
    setFieldErrors({});
    setIsPopupOpen(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setFormData({
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      paymentStatus: enrollment.paymentStatus,
      remarks: enrollment.remarks || "",
      transactionNumber: enrollment.transactionNumber || "",
      orderId: enrollment.orderId || "",
      paymentMethod: enrollment.paymentMethod || "",
      amountPaid: enrollment.amountPaid || "",
      currency: enrollment.currency || "INR",
    });
    setIsPopupOpen(true);
  };

  const handleDeleteEnrollment = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      setFullScreenLoading(true);
      try {
        await deleteEnrollment(id);
        setEnrollments(enrollments.filter((e) => e.id !== id));
        toast.success("Enrollment deleted successfully!");
      } catch (err) {
        console.error("Failed to delete enrollment:", err);
        toast.error("Failed to delete enrollment. Please try again.");
      } finally {
        setFullScreenLoading(false);
      }
    }
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.studentId) errors.studentId = true;
    if (!formData.courseId) errors.courseId = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Please fill all required fields");
      return;
    }

    setFieldErrors({});

    setSavingLoading(true);
    setFullScreenLoading(true);
    try {
      if (editingEnrollment) {
        await updateEnrollment(editingEnrollment.id, formData);
        setEnrollments(
          enrollments.map((e) =>
            e.id === editingEnrollment.id ? { ...e, ...formData } : e,
          ),
        );
        toast.success("Enrollment updated successfully!");
      } else {
        const response = await createEnrollment(formData);
        setEnrollments([response.data, ...enrollments]);
        toast.success("Enrollment created successfully!");
      }
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Failed to save enrollment:", err);
      toast.error("Failed to save enrollment. Please try again.");
    } finally {
      setSavingLoading(false);
      setFullScreenLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingEnrollment(null);
    setFormData({
      studentId: "",
      courseId: "",
      status: "PENDING",
      paymentStatus: "UNPAID",
      remarks: "",
      transactionNumber: "",
      orderId: "",
      paymentMethod: "",
      amountPaid: "",
      currency: "INR",
    });
  };

  const handleSearch = () => {
    fetchEnrollments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500 hover:bg-green-600";
      case "REJECTED":
        return "bg-red-500 hover:bg-red-600";
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-500";
      case "UNPAID":
        return "bg-red-500";
      case "FAILED":
        return "bg-orange-500";
      case "REFUNDED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Enrollments</h1>
        <button
          onClick={handleAddEnrollment}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Enrollment
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
                placeholder="Search by enrollment code, student name, or course name..."
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
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Payment Status</option>
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
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

      {/* Enrollments Table */}
      {loading ? (
        <div className="text-center py-10">Loading enrollments...</div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No enrollments found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {enrollment.enrollmentCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.studentName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {enrollment.studentEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.courseName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {enrollment.courseCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(
                        enrollment.status
                      )}`}
                    >
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getPaymentStatusColor(
                        enrollment.paymentStatus
                      )}`}
                    >
                      {enrollment.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.amountPaid
                      ? `${enrollment.currency} ${enrollment.amountPaid}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEnrollment(enrollment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEnrollment(enrollment.id)}
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
                {editingEnrollment ? "Edit Enrollment" : "Add Enrollment"}
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
                    Student *
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${
                      fieldErrors.studentId ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                  {fieldErrors.studentId && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select a student
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    className={`w-full px-3 py-2 border ${
                      fieldErrors.courseId ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseName} ({course.courseCode})
                      </option>
                    ))}
                  </select>
                  {fieldErrors.courseId && (
                    <p className="text-red-500 text-xs mt-1">
                      Please select a course
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PAYMENT_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    value={formData.amountPaid}
                    onChange={(e) =>
                      setFormData({ ...formData, amountPaid: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter amount paid"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter currency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Number
                  </label>
                  <input
                    type="text"
                    value={formData.transactionNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter transaction number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) =>
                      setFormData({ ...formData, orderId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter order ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter payment method"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter remarks"
                  rows="3"
                />
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
