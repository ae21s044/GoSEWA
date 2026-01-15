const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testLiveStock() {
  try {
    console.log('--- Starting Module 21 Test: Live Stock Management ---');

    console.log('1. Setting up Environment (Gaushala)');
    const gaushalaEmail = `gaushala_stock_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: gaushalaEmail, password: 'password123', user_type: 'GAUSHALA', phone: `91${Math.floor(Math.random() * 100000000)}` });
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email: gaushalaEmail, password: 'password123' });
    const token = loginRes.data.data.token;

    console.log('2. Adding Cattle');
    const cowRes = await axios.post(
        `${API_URL}/stock/cattle`,
        {
            tag_id: `GAU-${Math.floor(Math.random() * 1000)}`,
            name: 'Gauri',
            breed: 'Gir',
            gender: 'FEMALE',
            health_status: 'HEALTHY',
            milking_status: 'LACTATING'
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const cowId = cowRes.data.data.id;
    console.log('   Cattle Added. ID:', cowId);

    console.log('3. Adding Health Record');
    const healthRes = await axios.post(
        `${API_URL}/stock/cattle/${cowId}/health`,
        {
            record_type: 'VACCINATION',
            description: 'FMD Vaccine',
            doctor_name: 'Dr. Sharma',
            cost: 500,
            date: '2023-10-25'
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Health Record Added. Type:', healthRes.data.data.record_type);

    console.log('4. Logging Milk Production');
    const milkRes = await axios.post(
        `${API_URL}/stock/cattle/${cowId}/milk`,
        {
            date: '2023-10-26',
            morning_yield_liters: 6.5,
            evening_yield_liters: 5.0,
            fat_percentage: 4.2
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Milk Log Added. Total Yield:', milkRes.data.data.morning_yield_liters + milkRes.data.data.evening_yield_liters);

    console.log('5. Verifying Cattle Details');
    const listRes = await axios.get(`${API_URL}/stock/cattle`, { headers: { Authorization: `Bearer ${token}` } });
    const cow = listRes.data.data.find(c => c.id === cowId);
    
    if (cow) {
        if (cow.HealthRecords && cow.HealthRecords.length > 0) console.log('   SUCCESS: Health records linked.');
        else console.error('   FAILURE: Health records missing.');

        if (cow.MilkProductionLogs && cow.MilkProductionLogs.length > 0) console.log('   SUCCESS: Milk logs linked.');
        else console.error('   FAILURE: Milk logs missing.');
    } else {
        console.error('   FAILURE: Cattle not found in list.');
    }

    console.log('--- Module 21 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testLiveStock();
