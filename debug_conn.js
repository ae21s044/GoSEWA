const axios = require('axios');

const API_URL = 'http://localhost:3000'; // base

async function testConnection() {
    try {
        console.log('Testing /health...');
        const health = await axios.get(`${API_URL}/health`);
        console.log('Health:', health.data);

        console.log('Testing /api/v1/admin/stats (Expect 401/403/200, but not 404)');
        try {
            await axios.get(`${API_URL}/api/v1/admin/stats`);
        } catch (e) {
            console.log('Error status:', e.response ? e.response.status : e.message);
            console.log('Error data:', e.response ? e.response.data : '');
        }

    } catch (e) {
        console.error('Connection failed:', e.message);
    }
}
testConnection();
