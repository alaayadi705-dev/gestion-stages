const API = "http://localhost:8080/api/utilisateurs";

export const getUsers = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(API, {

    headers: {
      Authorization: "Bearer " + token
    }

  });

  return res.json();
};

export const addUser = async (user) => {

  const token = localStorage.getItem("token");

  await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },

    body: JSON.stringify(user)

  });

};

export const deleteUser = async (id) => {

  const token = localStorage.getItem("token");

  await fetch(API + "/" + id, {

    method: "DELETE",

    headers: {
      Authorization: "Bearer " + token
    }

  });

};