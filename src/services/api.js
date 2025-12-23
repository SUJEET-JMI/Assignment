const BASE = "https://fi1.api.radio-browser.info/json";

const json = async (r) => {
  if (!r.ok) throw new Error("API Error");
  return r.json();
};

/* ================= STATIONS ================= */
export const byClicks = (l = 20) =>
  fetch(`${BASE}/stations/topclick/${l}`).then(json);

export const byVotes = (l = 20) =>
  fetch(`${BASE}/stations/topvote/${l}`).then(json);

export const byRecentClick = (l = 20) =>
  fetch(`${BASE}/stations/lastclick/${l}`).then(json);

export const byRecentlyChanged = (l = 20) =>
  fetch(`${BASE}/stations/lastchange/${l}`).then(json);

export const oldVersions = () =>
  fetch(`${BASE}/stations/changed`).then(json);

export const brokenStations = () =>
  fetch(`${BASE}/stations/broken`).then(json);

/* ================= SEARCH ================= */
export const searchStations = (params) => {
  const q = new URLSearchParams(params).toString();
  return fetch(`${BASE}/stations/search?${q}`).then(json);
};

/* ================= FILTER ================= */
export const byCountry = (c) =>
  fetch(`${BASE}/stations/bycountry/${c}`).then(json);

export const byLanguage = (l) =>
  fetch(`${BASE}/stations/bylanguage/${l}`).then(json);

export const byTag = (t) =>
  fetch(`${BASE}/stations/bytag/${t}`).then(json);

/* ================= METADATA ================= */
export const getCountries = () => fetch(`${BASE}/countries`).then(json);
export const getLanguages = () => fetch(`${BASE}/languages`).then(json);
export const getTags = () => fetch(`${BASE}/tags`).then(json);
export const getCodecs = () => fetch(`${BASE}/codecs`).then(json);

/* ================= USER ACTION ================= */
export const countClick = (uuid) =>
  fetch(`${BASE}/url/${uuid}`).then(json);

export const voteStation = (uuid) =>
  fetch(`${BASE}/vote/${uuid}`).then(json);

/* ================= WRITE / STRUCT ================= */
export const addStation = (data) =>
  fetch(`${BASE}/stations/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(json);

export const structStation = () =>
  fetch(`${BASE}/struct/station`).then(json);

export const structStream = () =>
  fetch(`${BASE}/struct/stream`).then(json);

export const checkStation = (data) =>
  fetch(`${BASE}/checks/station`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(json);

export const checkStationStep = (data) =>
  fetch(`${BASE}/checks/station/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(json);
