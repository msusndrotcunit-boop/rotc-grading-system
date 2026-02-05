const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testLogin() {
    console.log('Testing Admin Login...');
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'msu-sndrotc_admin',
            password: 'admingrading@2026'
        });
        console.log('Login Success!');
        console.log('Status:', response.status);
        console.log('Token:', response.data.token ? 'Received' : 'Missing');
        console.log('Role:', response.data.role);
    } catch (error) {
        console.error('Login Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
