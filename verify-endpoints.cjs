const http = require('http');

const endpoints = [
    { name: 'Frontend (Vite)', url: 'http://localhost:5173/' },
    { name: 'Backend (Netlify Test)', url: 'http://localhost:9999/.netlify/functions/test' },
    { name: 'Backend (Cloudinary Test)', url: 'http://localhost:9999/.netlify/functions/test-cloudinary' }
];

async function checkEndpoint(endpoint) {
    return new Promise((resolve) => {
        const req = http.get(endpoint.url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`[${res.statusCode === 200 ? 'SUCCESS' : 'WARNING'}] ${endpoint.name}: Status ${res.statusCode}`);
                if (endpoint.name.includes('Backend') && res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        console.log(`   Response: ${JSON.stringify(json, null, 2)}`);
                    } catch (e) {
                        console.log(`   Response (Non-JSON): ${data.substring(0, 50)}...`);
                    }
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.log(`[FAILED] ${endpoint.name}: ${e.message}`);
            resolve();
        });
    });
}

async function runTests() {
    console.log('Starting Endpoint Verification...\n');
    for (const endpoint of endpoints) {
        await checkEndpoint(endpoint);
    }
    console.log('\nVerification Complete.');
}

runTests();
