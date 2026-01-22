import React, { useState } from "react";
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import { theme } from "../theme";

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("courses");

  const student = {
    name: "Abu Bin Ishtiyak",
    email: "info@softnio.com",
    phone: "+811 847-4958",
    country: "United States",
    joined: "12 Jan 2024",
    paid: 19,
    due: 10
  };

  const courses = [
    { id: 1, name: "Learn Android Development with project", status: "Active" },
    { id: 2, name: "Learn Android Development with project", status: "Pending" },
    { id: 3, name: "Learn Android Development with project", status: "Canceled" }
  ];

  const statusColor = {
    Active: theme.colors.success,
    Pending: "#F59E0B",
    Canceled: theme.colors.danger
  };

  return (
    <>
      <style>
        {`
          .student-profile-container {
            display: flex;
            gap: 24px;
            flex-direction: row;
          }
          .left-panel, .right-panel {
            background: ${theme.colors.card};
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .left-panel {
            flex: 0 0 320px;
          }
          .right-panel {
            flex: 1;
          }
          .table-responsive {
            overflow-x: auto;
          }
          @media (max-width: 768px) {
            .student-profile-container {
              flex-direction: column;
            }
            .left-panel, .right-panel {
              width: 100%;
            }
            .left-panel {
              flex: none;
            }
            .right-panel {
              flex: none;
            }
          }
        `}
      </style>
      <div style={{ minHeight: "100vh", background: theme.colors.secondary, padding: "24px", fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ color: theme.colors.textPrimary, fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            Students <span style={{ color: theme.colors.primary }}>/ {student.name}</span>
          </h2>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              padding: "10px 16px",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
            }}
            onMouseEnter={(e) => e.target.style.background = theme.colors.secondary}
            onMouseLeave={(e) => e.target.style.background = theme.colors.card}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="student-profile-container">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
                    fontSize: "1.1rem"
                  }}
                >
                  AB
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: "1.1rem", color: theme.colors.textPrimary }}>{student.name}</div>
                  <div style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>
                    {student.email}
                  </div>
                </div>
              </div>

              <MoreVertical size={18} color={theme.colors.textSecondary} style={{ cursor: "pointer" }} />
            </div>

            <hr style={{ margin: "24px 0", borderColor: theme.colors.border, borderWidth: "1px 0 0 0" }} />

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: theme.colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                TOTAL BILL
              </div>
              <div style={{ fontWeight: 600, color: theme.colors.primary, fontSize: "1.1rem", marginTop: 4 }}>
                Paid {student.paid} USD
              </div>
              <div style={{ color: theme.colors.danger, fontSize: "1rem", marginTop: 2 }}>
                Due {student.due} USD
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
          <div className="right-panel">
            {activeTab === "courses" && (
              <>
                <h3 style={{ marginBottom: 8, fontSize: "1.25rem", fontWeight: 600, color: theme.colors.textPrimary }}>Enrolled Courses</h3>
                <p style={{ color: theme.colors.textSecondary, marginBottom: 20, fontSize: "0.9rem", lineHeight: 1.5 }}>
                  Basic info, like what courses the student is enrolled in.
                </p>

                <div className="table-responsive">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ color: theme.colors.textSecondary, textAlign: "left", fontWeight: 500 }}>
                        <th style={{ padding: "12px 8px" }}>#</th>
                        <th style={{ padding: "12px 8px" }}>Course</th>
                        <th style={{ padding: "12px 8px" }}>Status</th>
                        <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <tr
                          key={c.id}
                          style={{ borderTop: `1px solid ${theme.colors.border}`, transition: "background 0.2s ease" }}
                          onMouseEnter={(e) => e.target.closest('tr').style.background = theme.colors.secondary}
                          onMouseLeave={(e) => e.target.closest('tr').style.background = 'transparent'}
                        >
                          <td style={{ padding: "12px 8px" }}>{c.id}</td>
                          <td style={{ padding: "12px 8px", fontWeight: 500 }}>{c.name}</td>
                          <td style={{ color: statusColor[c.status], fontWeight: 500, padding: "12px 8px" }}>
                            ● {c.status}
                          </td>
                          <td style={{ textAlign: "right", padding: "12px 8px" }}>
                            <Trash2 size={16} color={theme.colors.danger} style={{ cursor: "pointer" }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === "personal" && (
              <>
                <h3 style={{ marginBottom: 20, fontSize: "1.25rem", fontWeight: 600, color: theme.colors.textPrimary }}>Personal Information</h3>
                <InfoRow label="Full Name" value={student.name} />
                <InfoRow label="Email" value={student.email} />
                <InfoRow label="Phone" value={student.phone} />
                <InfoRow label="Country" value={student.country} />
                <InfoRow label="Joined Date" value={student.joined} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* Reusable Components */

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
        fontWeight: active ? 500 : 400
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
        padding: "10px 0"
      }}
    >
      <span style={{ color: theme.colors.textSecondary }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}
