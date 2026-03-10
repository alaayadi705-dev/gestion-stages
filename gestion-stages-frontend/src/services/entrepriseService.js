const API = "http://localhost:8080/api/entreprises";

export const getEntreprises = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(API, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return res.json();
};

export const addEntreprise = async (entreprise) => {

  const token = localStorage.getItem("token");

  await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },

    body: JSON.stringify(entreprise)

  });

};

export const deleteEntreprise = async (id) => {

  const token = localStorage.getItem("token");

  await fetch(API + "/" + id, {

    method: "DELETE",

    headers: {
      Authorization: "Bearer " + token
    }

  });

};