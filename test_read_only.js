const http = require('http');

const requestApi = (path, method, data, token) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const req = http.request(
      `http://localhost:8080${path}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

async function test() {
  console.log("1. Logging in as USER...");
  const loginRes = await requestApi('/api/auth/login', 'POST', { email: "user_test@gmail.com", password: "password123" });
  if (loginRes.status !== 200) {
    console.log("Login failed");
    return;
  }
  const token = JSON.parse(loginRes.body).token;
  console.log("Login OK");

  console.log("2. Attempting to get Stagiaires (Lecture seule)...");
  const getRes = await requestApi('/api/stagiaires', 'GET', null, token);
  console.log(`GET /api/stagiaires: [Status ${getRes.status}]`);

  console.log("3. Attempting to add a Stagiaire (Write)...");
  const postRes = await requestApi('/api/stagiaires', 'POST', { nom: "Test" }, token);
  console.log(`POST /api/stagiaires: [Status ${postRes.status}] Body: ${postRes.body}`);

  console.log("4. Attempting to add an Entreprise (Write)...");
  const postEnt = await requestApi('/api/entreprises', 'POST', { nom: "Entreprise Test" }, token);
  console.log(`POST /api/entreprises: [Status ${postEnt.status}] Body: ${postEnt.body}`);
}

test();
