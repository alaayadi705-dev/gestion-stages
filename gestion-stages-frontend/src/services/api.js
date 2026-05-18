// ============================
// API BASE URL
// ============================

const API = "http://localhost:8080/api";


// ============================
// HELPER SAFE JSON & AUTH HEADER
// ============================

const safeJson = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Erreur serveur inconnue" }));
    throw new Error(err.message || "Erreur " + res.status);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
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

export const forgotPasswordAPI = async (email) => {
  const res = await fetch(`${API}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return safeJson(res);
};

export const resetPasswordAPI = async (email, code, newPassword) => {
  const res = await fetch(`${API}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword })
  });
  return safeJson(res);
};


// ============================
// STAGIAIRES
// ============================

export const getStagiairesAPI = async () => {
  const res = await fetch(`${API}/stagiaires`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const addStagiaireAPI = async (stagiaire) => {
  const res = await fetch(`${API}/stagiaires`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(stagiaire)
  });
  return safeJson(res);
};

export const updateStagiaireAPI = async (id, stagiaire) => {
  const res = await fetch(`${API}/stagiaires/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(stagiaire)
  });
  return safeJson(res);
};

export const deleteStagiaireAPI = async (id) => {
  await fetch(`${API}/stagiaires/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};


// ============================
// ENTREPRISES
// ============================

export const getEntreprisesAPI = async () => {
  const res = await fetch(`${API}/entreprises`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const addEntrepriseAPI = async (entreprise) => {
  const res = await fetch(`${API}/entreprises`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(entreprise)
  });
  return safeJson(res);
};

export const updateEntrepriseAPI = async (id, entreprise) => {
  const res = await fetch(`${API}/entreprises/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(entreprise)
  });
  return safeJson(res);
};

export const deleteEntrepriseAPI = async (id) => {
  await fetch(`${API}/entreprises/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};


// ============================
// MINISTERES
// ============================

export const getMinisteresAPI = async () => {
    const res = await fetch(`${API}/ministeres`, { headers: getAuthHeaders() });
    return safeJson(res);
};

export const addMinistereAPI = async (ministere) => {
    const res = await fetch(`${API}/ministeres`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(ministere)
    });
    return safeJson(res);
};

export const updateMinistereAPI = async (id, ministere) => {
    const res = await fetch(`${API}/ministeres/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(ministere)
    });
    return safeJson(res);
};

export const deleteMinistereAPI = async (id) => {
    await fetch(`${API}/ministeres/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};

// ============================
// STAGES
// ============================

export const getStagesAPI = async () => {
  const res = await fetch(`${API}/stages`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const getAvailableStagesAPI = async () => {
  const res = await fetch(`${API}/stages/available`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const addStageAPI = async (stage) => {
  const res = await fetch(`${API}/stages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(stage)
  });
  return safeJson(res);
};

export const updateStageAPI = async (id, stage) => {
  const res = await fetch(`${API}/stages/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(stage)
  });
  return safeJson(res);
};

export const deleteStageAPI = async (id) => {
  await fetch(`${API}/stages/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};


// ============================
// RAPPORTS
// ============================

export const getRapportsAPI = async () => {
  const res = await fetch(`${API}/rapports`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const addRapportAPI = async (rapport) => {
  const res = await fetch(`${API}/rapports`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(rapport)
  });
  return safeJson(res);
};

export const updateRapportAPI = async (id, rapport) => {
  const res = await fetch(`${API}/rapports/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(rapport)
  });
  return safeJson(res);
};

export const deleteRapportAPI = async (id) => {
  await fetch(`${API}/rapports/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};


// ============================
// FRAIS
// ============================

export const getFraisAPI = async () => {
  const res = await fetch(`${API}/frais`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const addFraisAPI = async (frais) => {
  const res = await fetch(`${API}/frais`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(frais)
  });
  return safeJson(res);
};

export const updateFraisAPI = async (id, frais) => {
  const res = await fetch(`${API}/frais/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(frais)
  });
  return safeJson(res);
};

export const deleteFraisAPI = async (id) => {
  await fetch(`${API}/frais/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};


// ============================
// 🔥 USERS (FIXED FILTERS)
// ============================

export async function getUsersAPI(filters = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
  );
  const query = new URLSearchParams(cleanFilters).toString();
  const res = await fetch(`${API}/utilisateurs?${query}`, { headers: getAuthHeaders() });
  return safeJson(res);
}

export const addUserAPI = async (user) => {
  const res = await fetch(`${API}/utilisateurs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(user)
  });
  return safeJson(res);
};

export const updateUserAPI = async (id, user) => {
  const res = await fetch(`${API}/utilisateurs/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(user)
  });
  return safeJson(res);
};

export const deleteUserAPI = async (id) => {
  await fetch(`${API}/utilisateurs/${id}`, { method: "DELETE", headers: getAuthHeaders() });
};


// ============================
// STATISTIQUES
// ============================

export const getStatistiquesAPI = async () => {
  const res = await fetch(`${API}/statistiques`, { headers: getAuthHeaders() });
  return safeJson(res);
};

export const searchStagesAPI = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/stages/search?${query}`, { headers: getAuthHeaders() });
  return safeJson(res);
};