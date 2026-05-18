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

async function test() {
  console.log("=== Testing USER ===");
  const userRes = await login("tes@gmail.com", "123456");
  console.log("User Code:", userRes.status);
  console.log("User Body:", userRes.body.substring(0, 150));

  console.log("\n=== Testing SUPERVISEUR ===");
  const superRes = await login("aa@gmail.com", "123456");
  console.log("Superviseur Code:", superRes.status);
  console.log("Superviseur Body:", superRes.body.substring(0, 150));
  
  console.log("\n=== Testing ADMIN ===");
  const adminRes = await login("admin@gmail.com", "admin");
  console.log("Admin Code:", adminRes.status);
  console.log("Admin Body:", adminRes.body.substring(0, 150));
}

test();
