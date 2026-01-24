import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal, ChevronDown } from "lucide-react";
import Badge from "../components/Badge";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTeachers, updateTeacherStatus } from "../services/api";
const statusTypeMap = {
  APPROVED: "success",
  SUSPENDED: "warning",
  REJECTED: "danger",
};

const Avatar = ({ name, image }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return image ? (
    <img src={image} alt={name} className="w-9 h-9 rounded-full object-cover" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
      {initials}
    </div>
  );
};

export default function ApprovedTeacher() {
  const [teachers, setteachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openStatusIndex, setOpenStatusIndex] = useState(null);
  const [selectedteachers, setSelectedteachers] = useState([]);
  const statusOptions = ["APPROVED", "SUSPENDED", "TERMINATED"];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExportBar, setShowExportBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchteachers = async () => {
      setLoading(true);
      try {
        const params = { status: "APPROVED" };
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const response = await getTeachers(params);
        setteachers(response.data || []);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setteachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchteachers();
  }, [startDate, endDate]);

  const filteredteachers = teachers.filter(teachers =>
    teachers.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredteachers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "teachers");
    XLSX.writeFile(wb, "teachers.xlsx");
  };

  

const downloadPDF = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("teachers List", 14, 15);

  // Table columns
  const columns = [
    "ID",
    "Name",
    "Email",
    "Mobile",
    "Country",
    "Address",
    "Status",
  ];

  // Table rows
  const rows = filteredteachers.map((teachers) => [
    teachers.teacherId,
    teachers.name,
    teachers.email,
    teachers.mobile,
    teachers.country,
    teachers.address,
    teachers.status,
  ]);

  // Generate table
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 25,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] }, // green header
  });

  // Download PDF
  doc.save("teachers.pdf");
};


  const handleStatusChange = async (index, status) => {
    const teacher = filteredteachers[index];
    try {
      await updateTeacherStatus(teacher.userId, status);
      // Update local state
      const updated = teachers.map(s =>
        s.userId === teacher.userId ? { ...s, status: status } : s
      );
      setteachers(updated);
      setOpenStatusIndex(null);
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optionally show error to user
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedteachers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-800">
            Approved teachers
          </h1>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search teachers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-md text-sm w-full"
          />
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between mb-6">
        {/* Date Range */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div>
            <label className="text-xs text-gray-500 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <button
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 w-full sm:w-auto"
            onClick={() => {console.log("Download Excel", startDate, endDate), downloadExcel()}}
          >
            Download Excel

          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 w-full sm:w-auto"
            onClick={() => {console.log("Download PDF", startDate, endDate),downloadPDF()}}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto h-[70vh] overflow-y-auto relative">
          <table className="min-w-[1200px] text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left sticky top-0 z-10">
              <tr className="whitespace-nowrap">
                <th className="px-6 py-4">S.no</th>
                <th className="px-6 py-4">teachers</th>
                <th className="px-6 py-4">teachers ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4 hidden md:table-cell">Country</th>
                <th className="px-6 py-4 hidden md:table-cell">Address</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Approved Check</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-5 text-center text-gray-500">
                    Loading teachers...
                  </td>
                </tr>
              ) : filteredteachers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-5 text-center text-gray-500">
                    No approved teachers found.
                  </td>
                </tr>
              ) : (
                filteredteachers.map((s, i) => (
                <tr
                  key={s.userId}
                  className="border-t hover:bg-gray-50 whitespace-nowrap"
                >
                  <td className="px-6 py-5">{i + 1}</td>

                  <td className="px-6 py-5">
                    <div
                      onClick={() => navigate(`/teachers/profile/${s.userId}`)}
                      className="flex items-center gap-4 cursor-pointer"
                    >
                      <Avatar name={s.name} image={s.profileImage} />
                      <span className="font-medium text-gray-800 hover:text-indigo-600">
                        {s.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-medium">{s.teacherId}</td>
                  <td className="px-6 py-5 text-gray-500">{s.email}</td>
                  <td className="px-6 py-5 text-gray-500">{s.mobile}</td>
                  <td className="px-6 py-5 text-gray-500 hidden md:table-cell">{s.country}</td>

                  <td
                    className="px-6 py-5 max-w-[280px] truncate text-gray-500 hidden md:table-cell"
                    title={s.address}
                  >
                    {s.address}
                  </td>

                  <td className="relative px-6 py-5">
                    <button
                      onClick={() =>
                        setOpenStatusIndex(openStatusIndex === i ? null : i)
                      }
                      className="flex items-center gap-1"
                    >
                      

<Badge
  text={s.status}
  type={statusTypeMap[s.status] || "default"}
/>

<ChevronDown className="w-3 h-3 text-green-400" />

                    </button>

                    {openStatusIndex === i && (
                      <div className="absolute z-10 mt-2 w-36 bg-white border rounded-md shadow">
                        {statusOptions.map((status) => (
                          <div
                            key={status}
                            onClick={() => handleStatusChange(i, status)}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedteachers.includes(s.id)}
                      onChange={() => toggleSelectOne(s.id)}
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 text-xs text-gray-500">
          <div className="flex gap-2">
            <button className="border px-2 py-1 rounded">&lt;</button>
            <button className="border px-2 py-1 rounded">1</button>
            <button className="border px-2 py-1 rounded">2</button>
            <button className="border px-2 py-1 rounded">&gt;</button>
          </div>
          <span>Page 1 of 102</span>
        </div>
      </div>
    </div>
  );
}
