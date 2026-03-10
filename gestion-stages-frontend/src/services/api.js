// ============================
// API BASE URL
// ============================

const API = "http://localhost:8080/api";


// ============================
// HELPER SAFE JSON
// ============================

const safeJson = async (res) => {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};


// ============================
// AUTH
// ============================

export const loginAPI = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return safeJson(res);
};

export const registerAPI = async (user) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return safeJson(res);
};


// ============================
// STAGIAIRES
// ============================

export const getStagiairesAPI = async () => {
  const res = await fetch(`${API}/stagiaires`);
  return safeJson(res);
};

export const addStagiaireAPI = async (stagiaire) => {
  const res = await fetch(`${API}/stagiaires`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stagiaire)
  });
  return safeJson(res);
};

export const updateStagiaireAPI = async (id, stagiaire) => {
  const res = await fetch(`${API}/stagiaires/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stagiaire)
  });
  return safeJson(res);
};

export const deleteStagiaireAPI = async (id) => {
  await fetch(`${API}/stagiaires/${id}`, { method: "DELETE" });
};


// ============================
// ENTREPRISES
// ============================

export const getEntreprisesAPI = async () => {
  const res = await fetch(`${API}/entreprises`);
  return safeJson(res);
};

export const addEntrepriseAPI = async (entreprise) => {
  const res = await fetch(`${API}/entreprises`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entreprise)
  });
  return safeJson(res);
};

export const updateEntrepriseAPI = async (id, entreprise) => {
  const res = await fetch(`${API}/entreprises/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entreprise)
  });
  return safeJson(res);
};

export const deleteEntrepriseAPI = async (id) => {
  await fetch(`${API}/entreprises/${id}`, { method: "DELETE" });
};


// ============================
// STAGES
// ============================

export const getStagesAPI = async () => {
  const res = await fetch(`${API}/stages`);
  return safeJson(res);
};

export const addStageAPI = async (stage) => {
  const res = await fetch(`${API}/stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stage)
  });
  return safeJson(res);
};

export const updateStageAPI = async (id, stage) => {
  const res = await fetch(`${API}/stages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stage)
  });
  return safeJson(res);
};

export const deleteStageAPI = async (id) => {
  await fetch(`${API}/stages/${id}`, { method: "DELETE" });
};


// ============================
// RAPPORTS
// ============================

export const getRapportsAPI = async () => {
  const res = await fetch(`${API}/rapports`);
  return safeJson(res);
};

export const addRapportAPI = async (rapport) => {
  const res = await fetch(`${API}/rapports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rapport)
  });
  return safeJson(res);
};

export const updateRapportAPI = async (id, rapport) => {
  const res = await fetch(`${API}/rapports/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rapport)
  });
  return safeJson(res);
};

export const deleteRapportAPI = async (id) => {
  await fetch(`${API}/rapports/${id}`, { method: "DELETE" });
};


// ============================
// FRAIS
// ============================

export const getFraisAPI = async () => {
  const res = await fetch(`${API}/frais`);
  return safeJson(res);
};

export const addFraisAPI = async (frais) => {
  const res = await fetch(`${API}/frais`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(frais)
  });
  return safeJson(res);
};

export const updateFraisAPI = async (id, frais) => {
  const res = await fetch(`${API}/frais/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(frais)
  });
  return safeJson(res);
};

export const deleteFraisAPI = async (id) => {
  await fetch(`${API}/frais/${id}`, { method: "DELETE" });
};


// ============================
// USERS
// ============================

export const getUsersAPI = async () => {
  const res = await fetch(`${API}/users`);
  return safeJson(res);
};

export const addUserAPI = async (user) => {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return safeJson(res);
};

export const updateUserAPI = async (id, user) => {
  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return safeJson(res);
};

export const deleteUserAPI = async (id) => {
  await fetch(`${API}/users/${id}`, { method: "DELETE" });
};


// ============================
// STATISTIQUES
// ============================

export const getStatistiquesAPI = async () => {
  const res = await fetch(`${API}/statistiques`);
  return safeJson(res);
};