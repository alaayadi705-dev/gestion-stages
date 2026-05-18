const http = require('http');

const login = (email, password) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    const req = http.request(
      'http://localhost:8080/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, body });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

async function testFinal() {
  console.log("=== Testing ADMIN ===");
  const adminRes = await login("admin_test@gmail.com", "password123");
  console.log("Admin Code:", adminRes.status);
  console.log("Admin Role in Response:", JSON.parse(adminRes.body).role);

  console.log("\n=== Testing SUPERVISEUR ===");
  const superRes = await login("super_test@gmail.com", "password123");
  console.log("Superviseur Code:", superRes.status);
  console.log("Superviseur Role in Response:", JSON.parse(superRes.body).role);
  
  console.log("\n=== Testing USER ===");
  const userRes = await login("user_test@gmail.com", "password123");
  console.log("User Code:", userRes.status);
  console.log("User Role in Response:", JSON.parse(userRes.body).role);
}

testFinal();
