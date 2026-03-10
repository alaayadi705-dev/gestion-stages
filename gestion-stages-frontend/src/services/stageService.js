const API = "http://localhost:8080/api/stages";

export const getStages = async () => {

  const token = localStorage.getItem("token");

  const res = await fetch(API, {

    headers: {
      Authorization: "Bearer " + token
    }

  });

  return res.json();
};

export const addStage = async (stage) => {

  const token = localStorage.getItem("token");

  await fetch(API, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },

    body: JSON.stringify(stage)

  });

};

export const deleteStage = async (id) => {

  const token = localStorage.getItem("token");

  await fetch(API + "/" + id, {

    method: "DELETE",

    headers: {
      Authorization: "Bearer " + token
    }

  });

};