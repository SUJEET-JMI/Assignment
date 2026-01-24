 const BASE_URL = "http://localhost:5000/api"; // Adjust if backend runs on different port
// const BASE_URL = "https://classplus-iwn1.onrender.com/api"; // Adjust if backend runs on different port

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

// Classes API
export const createClass = async (classData) => {
  return fetch(`${BASE_URL}/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  }).then(json);
};

export const getAllClasses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/classes${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};

export const editClass = async (id, classData) => {
  return fetch(`${BASE_URL}/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(classData),
  }).then(json);
};

export const deleteClass = async (id) => {
  return fetch(`${BASE_URL}/classes/${id}`, {
    method: "DELETE",
  }).then(json);
};

export const updateClassStatus = async (id, status) => {
  return fetch(`${BASE_URL}/classes/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(json);
};
