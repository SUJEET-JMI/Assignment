import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createSubject,
  getAllSubjects,
  editSubject,
  deleteSubject,
  updateSubjectStatus,
  getAllClasses,
} from "../services/api";

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German"];

export default function Subject() {
  const [searchParams] = useSearchParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: "",
    ForClass: "",
    description: "",
    language: "",
  });
  const [updatingId, setUpdatingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [filterClass, setFilterClass] = useState(searchParams.get("class") || "");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showCustomLanguageInput, setShowCustomLanguageInput] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showCustomClassInput, setShowCustomClassInput] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [filterStatus, filterLanguage, filterClass]);

  useEffect(() => {
    fetchSubjects();
  }, [searchTerm]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterLanguage) params.language = filterLanguage;
      if (filterClass) params.ForClass = filterClass;
      const response = await getAllSubjects(params);
      let filteredSubjects = response.data || [];

      // Client-side search filtering
      if (searchTerm) {
        filteredSubjects = filteredSubjects.filter(
          (subject) =>
            subject.subjectName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            subject.subjectCode
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (subject.ForClass &&
              subject.ForClass.toLowerCase().includes(
                searchTerm.toLowerCase(),
              )),
        );
      }

      setSubjects(filteredSubjects);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      setClasses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setClasses([]);
    }
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({
      subjectName: "",
      ForClass: "",
      description: "",
      language: "",
    });
    setSelectedLanguages([]);
    setShowCustomLanguageInput(false);
    setSelectedClass("");
    setShowCustomClassInput(false);
    setIsPopupOpen(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      ForClass: subject.ForClass || "",
      description: subject.description || "",
      language: subject.language,
    });
    // Parse language string to array for editing
    const languageArray = subject.language
      ? subject.language.split(",").map((lang) => lang.trim())
      : [];
    const predefined = languageArray.filter((lang) => LANGUAGES.includes(lang));
    const custom = languageArray.filter((lang) => !LANGUAGES.includes(lang));
    setSelectedLanguages(predefined);
    if (custom.length > 0) {
      setShowCustomLanguageInput(true);
      setFormData((prev) => ({ ...prev, language: custom.join(", ") }));
    } else {
      setShowCustomLanguageInput(false);
      setFormData((prev) => ({ ...prev, language: "" }));
    }
    const classExists = classes.some(
      (cls) => cls.className === subject.ForClass,
    );
    if (classExists) {
      setSelectedClass(subject.ForClass);
      setShowCustomClassInput(false);
    } else {
      setSelectedClass("Other");
      setShowCustomClassInput(true);
    }
    setIsPopupOpen(true);
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setFullScreenLoading(true);
      try {
        await deleteSubject(id);
        setSubjects(subjects.filter((s) => s.id !== id));
        toast.success("Subject deleted successfully!");
      } catch (err) {
        console.error("Failed to delete subject:", err);
        toast.error("Failed to delete subject. Please try again.");
      } finally {
        setFullScreenLoading(false);
      }
    }
  };

  const handleSave = async () => {
    // Convert selected languages array to comma-separated string
    const languageString = selectedLanguages.join(", ");
    const updatedFormData = { ...formData, language: languageString };

    if (!formData.subjectName || selectedLanguages.length === 0) {
      toast.error(
        "Please fill all required fields (Subject Name and at least one Language)",
      );
      return;
    }

    setSavingLoading(true);
    setFullScreenLoading(true);
    try {
      if (editingSubject) {
        // Exclude subjectName from update as it's not allowed in backend
        const { subjectName, ...updateData } = updatedFormData;
        await editSubject(editingSubject.id, updateData);
        setSubjects(
          subjects.map((s) =>
            s.id === editingSubject.id ? { ...s, ...updateData } : s,
          ),
        );
        toast.success("Subject updated successfully!");
      } else {
        const response = await createSubject(updatedFormData);
        setSubjects([response.data, ...subjects]);
        toast.success("Subject added successfully!");
      }
      setIsPopupOpen(false);
      setShowCustomLanguageInput(false); // Close dropdown after save
    } catch (err) {
      console.error("Failed to save subject:", err);
      toast.error("Failed to save subject. Please try again.");
    } finally {
      setSavingLoading(false);
      setFullScreenLoading(false);
    }
  };

  const handleStatusChange = async (subject, newStatus) => {
    if (subject.status === newStatus) return;

    setFullScreenLoading(true);
    try {
      setUpdatingId(subject.id);

      await updateSubjectStatus(subject.id, newStatus);

      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subject.id ? { ...s, status: newStatus } : s,
        ),
      );

      toast.success(`Subject set to ${newStatus}`);
      setOpenMenuId(null); // close menu after action
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
    setEditingSubject(null);
    setFormData({
      subjectName: "",
      ForClass: "",
      description: "",
      language: "",
    });
    setSelectedLanguages([]);
    setShowCustomLanguageInput(false);
    setSelectedClass("");
    setShowCustomClassInput(false);
  };

  const handleSearch = () => {
    fetchSubjects();
  };

  const handleLanguageCheckboxChange = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };
  const handleCloseLanguageDropdown = () => {
  setShowCustomLanguageInput(false);
  setIsLanguageDropdownOpen(false);
};


  const handleAddCustomLanguage = () => {
  const value = formData.language.trim();
  if (!value) return;

  if (!selectedLanguages.includes(value)) {
    setSelectedLanguages([...selectedLanguages, value]);
  }

  // reset only input
  setFormData({ ...formData, language: "" });
};


  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClass(value);
    if (value === "Other") {
      setShowCustomClassInput(true);
      setFormData({ ...formData, ForClass: "" });
    } else {
      setShowCustomClassInput(false);
      setFormData({ ...formData, ForClass: value });
    }
  };

  const handleCustomClassChange = (e) => {
    setFormData({ ...formData, ForClass: e.target.value });
  };
  const handleCustomLanguageChange = (e) => {
  setFormData({
    ...formData,
    language: e.target.value,
  });
};


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Subjects</h1>
        <button
          onClick={handleAddSubject}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Subject
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
                placeholder="Search by name, code, or class..."
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              type="text"
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Filter by language..."
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="text-center py-10">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No subjects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {subject.subjectName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Code: {subject.subjectCode}
                  </p>
                  {subject.ForClass && (
                    <p className="text-sm text-gray-600">
                      Class: {subject.ForClass}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Language: {subject.language}
                  </p>
                  {subject.description && (
                    <p className="text-gray-600 mt-2 text-sm">
                      {subject.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    {/* MAIN BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === subject.id ? null : subject.id,
                        );
                      }}
                      className={`px-3 py-1 text-sm border rounded text-white flex items-center gap-1 ${
                        subject.status === "ACTIVE"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <Edit className="w-3 h-3" />
                      {subject.status}
                    </button>

                    {/* DROPDOWN MENU */}
                    {openMenuId === subject.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-50">
                        {/* ACTIVE OPTION */}
                        <button
                          disabled={updatingId === subject.id}
                          onClick={() => handleStatusChange(subject, "ACTIVE")}
                          className={`w-full px-4 py-2 text-left text-sm
          ${
            subject.status === "ACTIVE"
              ? "bg-green-50 text-green-700 font-semibold"
              : "hover:bg-gray-100"
          }
        `}
                        >
                          Activate
                        </button>

                        {/* INACTIVE OPTION */}
                        <button
                          disabled={updatingId === subject.id}
                          onClick={() =>
                            handleStatusChange(subject, "INACTIVE")
                          }
                          className={`w-full px-4 py-2 text-left text-sm
          ${
            subject.status === "INACTIVE"
              ? "bg-orange-50 text-orange-700 font-semibold"
              : "hover:bg-gray-100"
          }
        `}
                        >
                          Deactivate
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSubject(subject);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(subject.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingSubject ? "Edit Subject" : "Add Subject"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectName: e.target.value })
                  }
                  disabled={editingSubject ? true : false}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    editingSubject ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter subject name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  For Class
                </label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.className}>
                      {cls.className}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {showCustomClassInput && (
                  <input
                    type="text"
                    value={formData.ForClass}
                    onChange={handleCustomClassChange}
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter custom class"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language *
                </label>

                <div className="relative">
                  {/* Top Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md flex justify-between items-center"
                  >
                    <span>
                      {selectedLanguages.length
                        ? selectedLanguages.join(", ")
                        : "Select languages"}
                    </span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {isLanguageDropdownOpen && (
  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg p-2 max-h-60 overflow-y-auto">

    {/* Predefined languages */}
    {LANGUAGES.map((lang) => (
      <label key={lang} className="flex items-center py-1">
        <input
          type="checkbox"
          checked={selectedLanguages.includes(lang)}
          onChange={() => handleLanguageCheckboxChange(lang)}
          className="mr-2"
        />
        {lang}
      </label>
    ))}

    {/* Other */}
    <label className="flex items-center py-1">
      <input
        type="checkbox"
        checked={showCustomLanguageInput}
        onChange={() => setShowCustomLanguageInput(!showCustomLanguageInput)}
        className="mr-2"
      />
      Other
    </label>

    {/* Custom input + Add */}
    {showCustomLanguageInput && (
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={formData.language}
          onChange={handleCustomLanguageChange}
          placeholder="Enter custom language"
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleAddCustomLanguage}
          className="px-3 py-2 bg-green-600 text-white rounded-md"
        >
          Add
        </button>
      </div>
    )}

    {/* Bottom Done Button */}
    <button
      type="button"
      onClick={handleCloseLanguageDropdown}
      className="w-full mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md"
    >
      Done
    </button>
  </div>
)}

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter description (optional)"
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
