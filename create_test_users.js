const http = require('http');

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(user);
    const req = http.request(
      'http://localhost:8080/api/utilisateurs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

async function createAll() {
  console.log("Creating ADMIN...");
  const admin = await createUser({
    nom: "Admin",
    prenom: "Test",
    email: "admin_test@gmail.com",
    password: "password123",
    role: "ADMIN",
    ministere: "",
    poste: "Directeur"
  });
  console.log(admin.status, admin.body);

  console.log("Creating SUPERVISEUR...");
  const sup = await createUser({
    nom: "Super",
    prenom: "Test",
    email: "super_test@gmail.com",
    password: "password123",
    role: "SUPERVISEUR",
    ministere: "M1",
    poste: "Chef"
  });
  console.log(sup.status, sup.body);

  console.log("Creating USER...");
  const usr = await createUser({
    nom: "User",
    prenom: "Test",
    email: "user_test@gmail.com",
    password: "password123",
    role: "USER",
    ministere: "M1",
    poste: "Employé"
  });
  console.log(usr.status, usr.body);
}

createAll();
