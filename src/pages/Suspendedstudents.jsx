import React, { useState } from "react";
import { Search, MoreHorizontal, ChevronDown } from "lucide-react";
import Badge from "../components/Badge";

const statusOptions = ["Approved", "Suspended", "Terminated"];

const studentsData = [
  {
    id: "STU001",
    name: "Abu Bin Ishtiyak",
    email: "abu@gmail.com",
    mobile: "+811 847-4958",
    country: "United States",
    address: "742 Evergreen Terrace, Springfield, Illinois, United States",
    status: "Suspended",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "STU002",
    name: "Ashley Lawson",
    email: "ashley@gmail.com",
    mobile: "+124 394-1787",
    country: "United Kingdom",
    address: "221B Baker Street, London, United Kingdom",
    status: "Suspended",
    image: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "STU003",
    name: "Joe Larson",
    email: "joe@gmail.com",
    mobile: "+168 603-2320",
    country: "India",
    address: "Near MG Road Metro Station, Bengaluru, Karnataka, India",
    status: "Suspended",
    image: "",
  },
];
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

export default function Students() {
  const [students, setStudents] = useState(studentsData);
  const [openStatusIndex, setOpenStatusIndex] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleStatusChange = (index, status) => {
    const updated = [...students];
    updated[index].status = status;
    setStudents(updated);
    setOpenStatusIndex(null);
  };

  const toggleSelectOne = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Suspened Students</h1>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search student"
            className="pl-9 pr-4 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-4">#</th>
              <th>Student</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Country</th>
              <th>Address</th>
              <th>Status</th>
              <th className="p-4">#</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-4">{i + 1}</td>

                {/* Student (Image + Name) */}
                <td className="flex items-center gap-3 py-3">
                  <Avatar name={s.name} image={s.image} />
                  <span className="font-medium text-gray-800">{s.name}</span>
                </td>

                <td className="font-medium">{s.id}</td>
                <td className="text-gray-500">{s.email}</td>
                <td className="text-gray-500">{s.mobile}</td>
                <td className="text-gray-500">{s.country}</td>

                <td
                  className="max-w-[220px] truncate text-gray-500"
                  title={s.address}
                >
                  {s.address}
                </td>

                {/* Status Dropdown */}
                <td className="relative">
                  <button
                    onClick={() =>
                      setOpenStatusIndex(openStatusIndex === i ? null : i)
                    }
                    className="flex items-center gap-1"
                  >
                    <Badge
                      text={s.status}
                      type={
                        s.status === "Approved"
                          ? "success"
                          : s.status === "Suspended"
                            ? "info"
                            : "danger"
                      }
                    />
                    <ChevronDown className="w-3 h-3 text-gray-400" />
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
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={() => toggleSelectOne(s.id)}
                    className="w-4 h-4"
                  />
                </th>
              </tr>
            ))}
          </tbody>
        </table>
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
