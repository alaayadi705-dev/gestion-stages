const API = "http://localhost:8080/api/rapports";

export const getRapports = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(API, {

    headers: {
      Authorization: "Bearer " + token
    }

  });

  return res.json();
};

export const addRapport = async (rapport) => {

  const token = localStorage.getItem("token");

  await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },

    body: JSON.stringify(rapport)

  });

};

export const deleteRapport = async (id) => {

  const token = localStorage.getItem("token");

  await fetch(API + "/" + id, {

    method: "DELETE",

    headers: {
      Authorization: "Bearer " + token
    }

  });

};