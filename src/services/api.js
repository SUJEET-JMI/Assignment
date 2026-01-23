const BASE_URL = "http://localhost:3000/api"; // Adjust if backend runs on different port

const json = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Students API
export const getStudents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/students${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};

export const updateStudentStatus = async (userId, status) => {
  return fetch(`${BASE_URL}/students/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(json);
};

// Teachers API (if needed)
export const getTeachers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/teachers${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};

export const updateTeacherStatus = async (userId, status) => {
  return fetch(`${BASE_URL}/teachers/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(json);
};

// Parents API (if needed)
export const getParents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/parents${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};

export const updateParentStatus = async (userId, status) => {
  return fetch(`${BASE_URL}/parents/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(json);
};
