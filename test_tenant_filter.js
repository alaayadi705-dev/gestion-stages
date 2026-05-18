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

async function runTenantTests() {
  console.log("==========================================");
  console.log(" TESTING LOGIN & MULTI-TENANT ROLES FILTERS ");
  console.log("==========================================\n");

  // 1. Authentification
  console.log("1️⃣  AUTHENTIFICATION...");
  const adminRes = await requestApi('/api/auth/login', 'POST', { email: "admin_test@gmail.com", password: "password123" });
  const superRes = await requestApi('/api/auth/login', 'POST', { email: "super_test@gmail.com", password: "password123" });
  const userRes = await requestApi('/api/auth/login', 'POST', { email: "user_test@gmail.com", password: "password123" });

  const adminToken = adminRes.status === 200 ? JSON.parse(adminRes.body).token : null;
  const superToken = superRes.status === 200 ? JSON.parse(superRes.body).token : null;
  const userToken = userRes.status === 200 ? JSON.parse(userRes.body).token : null;

  console.log(`[ADMIN] Login Status: ${adminRes.status} | Token Present: ${!!adminToken}`);
  console.log(`[SUPERVISEUR] Login Status: ${superRes.status} | Token Present: ${!!superToken}`);
  console.log(`[USER] Login Status: ${userRes.status} | Token Present: ${!!userToken}\n`);

  if (!adminToken || !superToken || !userToken) {
    console.error("Test aborted: Erreur lors de la connexion. Les comptes n'existent peut-être pas ou le mdp est incorrect.");
    return;
  }

  // 2. Test Multi-Tenant GET Stagiaires
  console.log("2️⃣  TEST LECTURE (GET /api/stagiaires)...");
  
  const adminGet = await requestApi('/api/stagiaires', 'GET', null, adminToken);
  console.log(`[ADMIN] Peut voir tous les stagiaires ? Status: ${adminGet.status}`);
  if (adminGet.status === 200) {
    const list = JSON.parse(adminGet.body);
    console.log(` -> Reçu ${list.length} stagiaires (Accès total).`);
  }

  const superGet = await requestApi('/api/stagiaires', 'GET', null, superToken);
  console.log(`\n[SUPERVISEUR] Peut voir les stagiaires (filtrés par ministère) ? Status: ${superGet.status}`);
  if (superGet.status === 200) {
    const list = JSON.parse(superGet.body);
    console.log(` -> Reçu ${list.length} stagiaires (Filtrés par son propre ministère).`);
  }

  const userGet = await requestApi('/api/stagiaires', 'GET', null, userToken);
  console.log(`\n[USER] Peut voir les stagiaires (lecture seule) ? Status: ${userGet.status}`);
  if (userGet.status === 200) {
    const list = JSON.parse(userGet.body);
    console.log(` -> Reçu ${list.length} stagiaires.`);
  }

  // 3. Test Restrictions Création/Écriture
  console.log("\n3️⃣  TEST ÉCRITURE (Restrictions de Rôles)...");

  console.log("\n--- USER (Ne doit PAS pouvoir créer de stagiaire) ---");
  const userPost = await requestApi('/api/stagiaires', 'POST', { nom: "Test Hacking User" }, userToken);
  console.log(`[USER] POST /api/stagiaires -> Status attendu "403 Forbidden" | Obtenu: ${userPost.status}`);

  console.log("\n--- SUPERVISEUR (Doit pouvoir créer/éditer son périmètre) ---");
  const superPost = await requestApi('/api/stagiaires', 'POST', { 
    nom: "Stagiaire Créé par Superviseur",
    ministere: "M2" // Tentative de créer pour un autre ministère
  }, superToken);
  console.log(`[SUPERVISEUR] POST /api/stagiaires -> Status attendu "200 ou 403 (selon tenant)" | Obtenu: ${superPost.status}`);

  console.log("\n--- ADMIN (Doit tout pouvoir) ---");
  const adminFilterGet = await requestApi('/api/utilisateurs', 'GET', null, adminToken);
  console.log(`[ADMIN] GET /api/utilisateurs -> ${adminFilterGet.status === 200 ? "Succès" : "Échec"}`);

  console.log("\n================ FIN DU TEST ================");
}

runTenantTests();
