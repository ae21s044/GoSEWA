const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testReportingEngine() {
  try {
    console.log('--- Starting Module 27 Test: Reporting Engine ---');

    console.log('1. Setting up Environment (Gaushala)');
    const email = `report_gau_${Date.now()}@test.com`;
    const phone = `40${Math.floor(Math.random() * 100000000)}`;
    await axios.post(`${API_URL}/auth/register`, { email, password: 'password123', user_type: 'GAUSHALA', phone });
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: 'password123' });
    const token = loginRes.data.data.token;
    
    // Create Data for Reporting
    // Create Product
    const catRes = await axios.post(`${API_URL}/inventory/categories`, { name: `RepCat ${Date.now()}` }, { headers: { Authorization: `Bearer ${token}` } });
    await axios.post(`${API_URL}/inventory/products`, {
        name: 'Report Prod 1', category_id: catRes.data.data.id, price_per_unit: 100, initial_quantity: 100, unit_type: 'KG'
    }, { headers: { Authorization: `Bearer ${token}` } });

    // Log Waste for Impact Report
    await axios.post(`${API_URL}/waste/collection`, {
        date: new Date(), waste_type: 'DUNG', quantity: 50, unit: 'KG'
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log('2. Testing Inventory Report');
    const invRes = await axios.get(`${API_URL}/reports/inventory`, { headers: { Authorization: `Bearer ${token}` } });
    if (invRes.data.success && invRes.data.data.total_products >= 1) {
        console.log('   SUCCESS: Inventory Report generated.', invRes.data.data);
    } else {
        console.error('   FAILURE: Inventory Report invalid.');
    }

    console.log('3. Testing Impact Report');
    const impRes = await axios.get(`${API_URL}/reports/impact`, { headers: { Authorization: `Bearer ${token}` } });
    if (impRes.data.success && impRes.data.data.total_waste_processed_kg >= 50) {
        console.log('   SUCCESS: Impact Report correct.', impRes.data.data.impact_metrics);
    } else {
        console.error('   FAILURE: Impact Report data mismatch.');
    }

    console.log('4. Testing Sales Report (Empty for now)');
    // We haven't placed orders for this specific gaushala in this test script, so it should be valid but empty/zero.
    const salesRes = await axios.get(`${API_URL}/reports/sales`, { headers: { Authorization: `Bearer ${token}` } });
    if (salesRes.data.success && salesRes.data.data.summary) {
        console.log('   SUCCESS: Sales Report structure valid.', salesRes.data.data.summary);
        // Expect totalRevenue = 0
        if (salesRes.data.data.summary.totalRevenue === 0) {
            console.log('   Verified empty revenue for new user.');
        }
    } else {
        console.error('   FAILURE: Sales Report invalid.');
    }
    
    // Test CSV Export
    console.log('5. Testing Sales Report CSV');
    const csvRes = await axios.get(`${API_URL}/reports/sales?format=csv`, { headers: { Authorization: `Bearer ${token}` } });
    if (typeof csvRes.data === 'string' && csvRes.data.includes('Date,Revenue')) {
         console.log('   SUCCESS: CSV Format received.');
    } else {
         console.error('   FAILURE: CSV Format invalid.');
    }

    console.log('--- Module 27 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testReportingEngine();
