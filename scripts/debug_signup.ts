
import 'dotenv/config';

const BASE_URL = process.env.APP_PUBLIC_URL || 'http://localhost:3000';

async function run() {
    const email = `debug_${Date.now()}@example.com`;
    const username = `u_${Math.floor(Date.now() / 1000)}`;

    console.log(`Attempting signup with: ${email}, ${username}`);

    try {
        const res = await fetch(`${BASE_URL}/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email, username, password: 'password123', displayName: 'Debug User'
            })
        });

        const data = await res.json();
        console.log('Response Status:', res.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

run();
