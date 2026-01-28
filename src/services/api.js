 const BASE_URL = "http://localhost:5000/api"; // Adjust if backend runs on different port
// const BASE_URL = "https://classplus-iwn1.onrender.com/api"; // Adjust if backend runs on different port

export const BACKEND_BASE_URL = "http://localhost:5000"; // For static files

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

export const updateStudentStatus = async (studentId, status) => {
  return fetch(`${BASE_URL}/students/${studentId}/status`, {
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

export const updateTeacherStatus = async (teacherId, status) => {
  return fetch(`${BASE_URL}/teachers/${teacherId}/status`, {
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

export const updateParentStatus = async (parentId, status) => {
  return fetch(`${BASE_URL}/parents/${parentId}/status`, {
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

// Subjects API
export const createSubject = async (subjectData) => {
  return fetch(`${BASE_URL}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subjectData),
  }).then(json);
};

export const getAllSubjects = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/subjects${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};

export const editSubject = async (subjectCode, subjectData) => {
  return fetch(`${BASE_URL}/subjects/${subjectCode}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subjectData),
  }).then(json);
};

export const deleteSubject = async (subjectCode) => {
  return fetch(`${BASE_URL}/subjects/${subjectCode}`, {
    method: "DELETE",
  }).then(json);
};

export const updateSubjectStatus = async (subjectCode, status) => {
  return fetch(`${BASE_URL}/subjects/${subjectCode}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }).then(json);
};
export const createCourse = async (courseData) => {
  const formData = new FormData();

  // Append all fields to FormData
  Object.keys(courseData).forEach(key => {
    if (courseData[key] !== null && courseData[key] !== undefined) {
      if (key === 'thumbnail' && courseData[key] instanceof File) {
        formData.append('thumbnail', courseData[key]);
      } else {
        formData.append(key, courseData[key]);
      }
    }
  });

  return fetch(`${BASE_URL}/courses`, {
    method: "POST",
    body: formData,
  }).then(json);
};
export const getAllCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/courses${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};
export const editCourse = async (courseCode, courseData) => {
  const formData = new FormData();

  // Append all fields to FormData
  Object.keys(courseData).forEach(key => {
    if (courseData[key] !== null && courseData[key] !== undefined) {
      if (key === 'thumbnail' && courseData[key] instanceof File) {
        formData.append('thumbnail', courseData[key]);
      } else {
        formData.append(key, courseData[key]);
      }
    }
  });

  return fetch(`${BASE_URL}/courses/${courseCode}`, {
    method: "PUT",
    body: formData,
  }).then(json);
};
export const deleteCourse = async (courseCode) => {
  return fetch(`${BASE_URL}/courses/${courseCode}`, {
  method: "DELETE",
  }).then(json);
};
export const updateCourseStatus = async (courseCode, status) => {
  return fetch(`${BASE_URL}/courses/${courseCode}/status`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status }),
  }).then(json);
};
export const getCourseById = async (courseCode) => {
  return fetch(`${BASE_URL}/courses/${courseCode}`).then(json);
};

// Enrollments API
export const createEnrollment = async (enrollmentData) => {
  return fetch(`${BASE_URL}/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrollmentData),
  }).then(json);
};

export const getAllEnrollments = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/enrollments${query ? `?${query}` : ""}`;
  return fetch(url).then(json);
};

export const getEnrollmentById = async (enrollmentCode) => {
  return fetch(`${BASE_URL}/enrollments/${enrollmentCode}`).then(json);
};

export const updateEnrollment = async (enrollmentCode, updateData) => {
  return fetch(`${BASE_URL}/enrollments/${enrollmentCode}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  }).then(json);
};

export const deleteEnrollment = async (enrollmentCode) => {
  return fetch(`${BASE_URL}/enrollments/${enrollmentCode}`, {
    method: "DELETE",
  }).then(json);
};


