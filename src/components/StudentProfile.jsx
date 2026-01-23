import React, { useState } from "react";
import { ArrowLeft, MoreVertical, Trash2, } from "lucide-react";
import { theme } from "../theme";

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("courses");
  const thStyle = {
  padding: "14px 16px",
  fontWeight: 500,
  textAlign: "left",
};

const tdStyle = {
  padding: "16px",
  fontSize: 14,
  color: theme.colors.textPrimary,
};


  const [studentData, setStudentData] = useState({
    id: "STU001",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    mobile: "9876543210",
    country: "India",
    address: "New Delhi, India",
    parentName: "Amit Sharma",
    parentEmail: "amit@gmail.com",
    parentMobile: "9876500000",

    status: "Approved",
    image: "https://i.pravatar.cc/150?img=12",
  });

  const [formData, setFormData] = useState(studentData);

  const courses = [
    { id: 1, name: "Learn Android Development with project", status: "Active" },
    {
      id: 2,
      name: "Learn Android Development with project",
      status: "Pending",
    },
    {
      id: 3,
      name: "Learn Android Development with project",
      status: "Canceled",
    },
  ];

  const statusColor = {
    Active: theme.colors.success,
    Pending: "#F59E0B",
    Canceled: theme.colors.danger,
  };



  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: theme.colors.secondary,
          padding: 24,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 600 }}>
            Students{" "}
            <span style={{ color: theme.colors.primary }}>
              / {studentData.name}
            </span>
          </h2>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 8,
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.card,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* LEFT PANEL */}
          <div
            style={{
              width: 320,
              background: theme.colors.card,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: theme.colors.primary,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {studentData.image ? (
                    <img
                      src={studentData.image}
                      alt={studentData.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    studentData.name.charAt(0)
                  )}
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>{studentData.name}</div>
                  <div
                    style={{ fontSize: 14, color: theme.colors.textSecondary }}
                  >
                    {studentData.id}
                  </div>
                </div>
              </div>

              
            </div>

            <hr
              style={{ margin: "24px 0", borderColor: theme.colors.border }}
            />

            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <TabButton
                label="Personal Information"
                active={activeTab === "personal"}
                onClick={() => setActiveTab("personal")}
              />
              <TabButton
                label="Courses"
                active={activeTab === "courses"}
                onClick={() => setActiveTab("courses")}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              flex: 1,
              background: theme.colors.card,
              borderRadius: 16,
              padding: 24,
            }}
          >
            {activeTab === "personal" && (
              <>
                <h3 style={{ marginBottom: 16 }}>Personal Information</h3>

                <InfoRow label="Full Name" value={studentData.name} />
                <InfoRow label="Email" value={studentData.email} />
                <InfoRow label="Mobile Number" value={studentData.mobile} />
                <InfoRow label="Country" value={studentData.country} />
                <InfoRow label="Address" value={studentData.address} />

                <h3 style={{ margin: "24px 0 16px" }}>Parent Information</h3>

                <InfoRow label="Parent Name" value={studentData.parentName} />
                <InfoRow label="Parent Email" value={studentData.parentEmail} />
                <InfoRow
                  label="Parent Mobile"
                  value={studentData.parentMobile}
                />
              </>
            )}

            {activeTab === "courses" && (
  <>
    <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>
      Enrolled Courses
    </h3>

    <div
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <table width="100%" style={{ borderCollapse: "collapse" }}>
        <thead
          style={{
            background: theme.colors.secondary,
            color: theme.colors.textSecondary,
            fontSize: 14,
          }}
        >
          <tr>
            <th style={thStyle}>S.no</th>
            <th style={thStyle}>Course Name</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((c) => (
            <tr
              key={c.id}
              style={{
                borderTop: `1px solid ${theme.colors.border}`,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme.colors.secondary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <td style={tdStyle}>{c.id}</td>

              <td style={{ ...tdStyle, fontWeight: 500 }}>{c.name}</td>

              <td style={tdStyle}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 500,
                    background: `${statusColor[c.status]}20`,
                    color: statusColor[c.status],
                  }}
                >
                  {c.status}
                </span>
              </td>

              <td style={{ ...tdStyle, textAlign: "right" }}>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={16} color={theme.colors.danger} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}

          </div>
        </div>
      </div>

    </>
  );
}

/* ===== Reusable Components ===== */

function TabButton({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 10,
        borderRadius: 8,
        cursor: "pointer",
        background: active ? theme.colors.secondary : "transparent",
        color: active ? theme.colors.primary : theme.colors.textPrimary,
      }}
    >
      {label}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: "10px 0",
      }}
    >
      <span style={{ color: theme.colors.textSecondary }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}
