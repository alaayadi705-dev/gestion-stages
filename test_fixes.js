const http = require('http');

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    let data = '';
    if (body) {
      data = JSON.stringify(body);
      headers['Content-Length'] = data.length;
    }

    const req = http.request(
      `http://localhost:8080${path}`,
      { method, headers },
      (res) => {
        let resBody = '';
        res.on('data', chunk => resBody += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, body: resBody ? JSON.parse(resBody) : null });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runTests() {
  console.log("=========================================");
  console.log("   TESTING API AFTER FIXES");
  console.log("=========================================\n");

  const accounts = [
    { email: "admin@gmail.com", pass: "password123", name: "ADMIN" },
    { email: "super@gmail.com", pass: "password123", name: "SUPERVISEUR" },
    { email: "user@gmail.com", pass: "password123", name: "USER" }
  ];

  for (const account of accounts) {
    console.log(`\n---> Testing as ${account.name} (${account.email})`);
    
    // 1. Login
    const loginRes = await makeRequest('POST', '/api/auth/login', { email: account.email, password: account.pass });
    if (loginRes.status !== 200) {
      console.log(`[LOGIN FAILED] Status: ${loginRes.status}`);
      continue;
    }
    const token = loginRes.body.token;
    console.log(`[LOGIN SUCCESS] Token received.`);

    // 2. Fetch Utilisateurs
    const usersRes = await makeRequest('GET', '/api/utilisateurs', null, token);
    console.log(`[GET /api/utilisateurs] Status: ${usersRes.status}`);
    if (usersRes.status === 200) {
      console.log(`   -> Fetched ${Array.isArray(usersRes.body) ? usersRes.body.length : "NOT AN ARRAY"} users.`);
    } else {
      console.log(`   -> Error: ${JSON.stringify(usersRes.body)}`);
    }

    // 3. Fetch Ministeres
    const minRes = await makeRequest('GET', '/api/ministeres', null, token);
    console.log(`[GET /api/ministeres] Status: ${minRes.status}`);
    if (minRes.status === 200) {
      console.log(`   -> Fetched ${Array.isArray(minRes.body) ? minRes.body.length : "NOT AN ARRAY"} ministeres.`);
    } else {
      console.log(`   -> Error: ${JSON.stringify(minRes.body)}`);
    }
  }
}

runTests();
