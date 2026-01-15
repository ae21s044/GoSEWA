const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testMobileBackend() {
  try {
    console.log('--- Starting Module 25 Test: Mobile Backend ---');

    console.log('1. Testing App Config (Public)');
    const configRes = await axios.get(`${API_URL}/mobile/config`);
    if (configRes.data.success && configRes.data.data.min_version) {
        console.log('   SUCCESS: App Config received.');
        console.log('   Latest Version:', configRes.data.data.latest_version);
    } else {
        console.error('   FAILURE: App Config invalid.');
    }

    console.log('2. Setting up Environment (User)');
    const email = `mobile_user_${Date.now()}@test.com`;
    const phone = `70${Math.floor(Math.random() * 100000000)}`;
    await axios.post(`${API_URL}/auth/register`, { email, password: 'password123', user_type: 'ENTREPRENEUR', phone });
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: 'password123' });
    const token = loginRes.data.data.token;

    console.log('3. Testing Home Screen Aggregation');
    const homeRes = await axios.get(`${API_URL}/mobile/home`, { headers: { Authorization: `Bearer ${token}` } });
    const data = homeRes.data.data;
    
    if (data.profile && data.stats && data.featured_products) {
        console.log('   SUCCESS: Home Screen aggregation structure correct.');
        console.log('   Unread Notifications:', data.stats.unread_notifications);
        console.log('   Active Orders:', data.stats.active_orders);
    } else {
        console.error('   FAILURE: Home Screen structure incorrect:', Object.keys(data));
    }

    console.log('--- Module 25 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testMobileBackend();
