const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testMonitoring() {
  try {
    console.log('--- Starting Module 28 Test: System Monitoring ---');

    console.log('1. Setting up Environment (Admin User)');
    const email = `monitor_admin_${Date.now()}@test.com`;
    const phone = `30${Math.floor(Math.random() * 100000000)}`;
    
    // Quick register as ADMIN (assuming allowed for dev/test)
    await axios.post(`${API_URL}/auth/register`, { 
        email, password: 'password123', user_type: 'ADMIN', phone 
    });
    
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: 'password123' });
    const token = loginRes.data.data.token;
    
    console.log('2. Testing Metrics Endpoint');
    const metricsRes = await axios.get(`${API_URL}/monitoring/metrics`, { headers: { Authorization: `Bearer ${token}` } });
    if (metricsRes.data.success && metricsRes.data.data.os) {
        console.log('   SUCCESS: Metrics received.');
        console.log('   OS Platform:', metricsRes.data.data.os.platform);
        console.log('   System Free Mem:', metricsRes.data.data.memory.free_system_bytes);
    } else {
        console.error('   FAILURE: Metrics invalid.');
    }

    console.log('3. Testing Health Endpoint');
    const healthRes = await axios.get(`${API_URL}/monitoring/health`, { headers: { Authorization: `Bearer ${token}` } });
    if (healthRes.data.success && healthRes.data.data.checks.database.status === 'Connected') {
        console.log('   SUCCESS: Health Check passed (DB Connected).');
    } else {
        console.error('   FAILURE: Health Check failed or DB disconnected.', healthRes.data.data);
    }
    
    console.log('4. Testing Access Control (Non-Admin)');
    // Register normal user
    const userEmail = `monitor_user_${Date.now()}@test.com`;
    const userPhone = `31${Math.floor(Math.random() * 100000000)}`;
    await axios.post(`${API_URL}/auth/register`, { email: userEmail, password: 'password123', user_type: 'ENTREPRENEUR', phone: userPhone });
    const userLogin = await axios.post(`${API_URL}/auth/login`, { email: userEmail, password: 'password123' });
    const userToken = userLogin.data.data.token;
    
    try {
        await axios.get(`${API_URL}/monitoring/metrics`, { headers: { Authorization: `Bearer ${userToken}` } });
        console.error('   FAILURE: Non-Admin was able to access Monitoring API.');
    } catch (err) {
        if (err.response && err.response.status === 403) {
            console.log('   SUCCESS: Non-Admin blocked (403 Forbidden).');
        } else {
            console.error('   FAILURE: Unexpected error for Non-Admin:', err.message);
        }
    }

    console.log('--- Module 28 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testMonitoring();
