const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testWasteToValue() {
  try {
    console.log('--- Starting Module 22 Test: Waste-to-Value Tracking ---');

    console.log('1. Setting up Environment (Gaushala)');
    const gaushalaEmail = `gaushala_waste_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: gaushalaEmail, password: 'password123', user_type: 'GAUSHALA', phone: `91${Math.floor(Math.random() * 100000000)}` });
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email: gaushalaEmail, password: 'password123' });
    const token = loginRes.data.data.token;

    console.log('2. Logging Waste Collection');
    const waste1 = await axios.post(
        `${API_URL}/waste/collection`,
        { date: '2023-11-01', waste_type: 'DUNG', quantity: 500, unit: 'KG' },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Logged 500KG Dung.');

    const waste2 = await axios.post(
        `${API_URL}/waste/collection`,
        { date: '2023-11-02', waste_type: 'DUNG', quantity: 300, unit: 'KG' },
        { headers: { Authorization: `Bearer ${token}` } }
    );
     console.log('   Logged 300KG Dung.');

    console.log('3. Logging Byproduct Production');
    const prod1 = await axios.post(
        `${API_URL}/waste/production`,
        { date: '2023-11-03', product_type: 'BIOGAS', quantity: 20, unit: 'M3' },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Logged 20 M3 Biogas.');

    console.log('4. Verifying Summary');
    const summaryRes = await axios.get(`${API_URL}/waste/summary`, { headers: { Authorization: `Bearer ${token}` } });
    const summary = summaryRes.data.data;
    
    // Check Waste Totals
    const dungTotal = summary.waste_collected.find(w => w.waste_type === 'DUNG' && w.unit === 'KG');
    if (dungTotal && parseFloat(dungTotal.total_quantity) === 800) {
        console.log('   SUCCESS: Dung total correct (800 KG).');
    } else {
        console.error('   FAILURE: Dung total incorrect:', dungTotal);
    }

    // Check Production Totals
    const biogasTotal = summary.byproducts_produced.find(p => p.product_type === 'BIOGAS' && p.unit === 'M3');
    if (biogasTotal && parseFloat(biogasTotal.total_quantity) === 20) {
        console.log('   SUCCESS: Biogas total correct (20 M3).');
    } else {
        console.error('   FAILURE: Biogas total incorrect:', biogasTotal);
    }

    console.log('--- Module 22 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testWasteToValue();
