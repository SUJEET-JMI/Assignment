import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  createClass,
  getAllClasses,
  editClass,
  deleteClass,
  updateClassStatus,
} from "../services/api";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: "",
    class_description: "",
  });
  const [updatingId, setUpdatingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [fullScreenLoading, setFullScreenLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await getAllClasses();
      setClasses(response.data || []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setFormData({ className: "", class_description: "" });
    setIsPopupOpen(true);
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls);
    setFormData({
      className: cls.className,
      class_description: cls.class_description,
    });
    setIsPopupOpen(true);
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setFullScreenLoading(true);
      try {
        await deleteClass(id);
        setClasses(classes.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Failed to delete class:", err);
      } finally {
        setFullScreenLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!formData.className || !formData.class_description) {
      toast.error("Please fill all fields");
      return;
    }

    setSavingLoading(true);
    setFullScreenLoading(true);
    try {
      if (editingClass) {
        await editClass(editingClass.id, formData);
        setClasses(
          classes.map((c) =>
            c.id === editingClass.id ? { ...c, ...formData } : c,
          ),
        );
        toast.success("Class updated successfully!");
      } else {
        const response = await createClass(formData);
        setClasses([response.data, ...classes]);
        toast.success("Class added successfully!");
      }
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Failed to save class:", err);
      toast.error("Failed to save class. Please try again.");
    } finally {
      setSavingLoading(false);
      setFullScreenLoading(false);
    }
  };

  const handleStatusChange = async (cls, newStatus) => {
    if (cls.status === newStatus) return;

    setFullScreenLoading(true);
    try {
      setUpdatingId(cls.id);

      await updateClassStatus(cls.id, newStatus);

      setClasses((prev) =>
        prev.map((c) => (c.id === cls.id ? { ...c, status: newStatus } : c)),
      );

      toast.success(`Class set to ${newStatus}`);
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
    setEditingClass(null);
    setFormData({ className: "", class_description: "" });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Classes</h1>
        <button
          onClick={handleAddClass}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="text-center py-10">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No classes found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {cls.className}
                  </h3>
                  <p className="text-gray-600 mt-2">{cls.class_description}</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    {/* MAIN BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cls.id ? null : cls.id);
                      }}
                      className={`px-3 py-1 text-sm border rounded text-white flex items-center gap-1 ${
                        cls.status === "ACTIVE"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                    <Edit className="w-3 h-3" />
                      {cls.status}
                      
                    </button>

                    {/* DROPDOWN MENU */}
                    {openMenuId === cls.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-50">
                        {/* ACTIVE OPTION */}
                        <button
                          disabled={updatingId === cls.id}
                          onClick={() => handleStatusChange(cls, "ACTIVE")}
                          className={`w-full px-4 py-2 text-left text-sm
          ${
            cls.status === "ACTIVE"
              ? "bg-green-50 text-green-700 font-semibold"
              : "hover:bg-gray-100"
          }
        `}
                        >
                          Activate
                        </button>

                        {/* INACTIVE OPTION */}
                        <button
                          disabled={updatingId === cls.id}
                          onClick={() => handleStatusChange(cls, "INACTIVE")}
                          className={`w-full px-4 py-2 text-left text-sm
          ${
            cls.status === "INACTIVE"
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
                      handleEditClass(cls);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(cls.id);
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
                {editingClass ? "Edit Class" : "Add Class"}
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
                  Class Name
                </label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter class name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Description
                </label>
                <textarea
                  value={formData.class_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter class description"
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
