const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testModule14() {
  try {
    console.log('--- Starting Module 14 Verification ---');

    console.log('1. Setup context...');
    const TS = Date.now();
    
    // Register G (Seller)
    const gEmail = `g_sub_${TS}@t.com`;
    await axios.post(`${BASE_URL}/auth/register`, { email: gEmail, password: 'Pass', phone: `98${TS.toString().slice(-8)}`, user_type: 'GAUSHALA' });
    const gLogin = await axios.post(`${BASE_URL}/auth/login`, { email: gEmail, password: 'Pass' });
    const gToken = gLogin.data.data.token;
    const gConfig = { headers: { Authorization: `Bearer ${gToken}` } };

    // Register E (Subscriber)
    const eEmail = `e_sub_${TS}@t.com`;
    await axios.post(`${BASE_URL}/auth/register`, { email: eEmail, password: 'Pass', phone: `99${TS.toString().slice(-8)}`, user_type: 'ENTREPRENEUR' });
    const eLogin = await axios.post(`${BASE_URL}/auth/login`, { email: eEmail, password: 'Pass' });
    const eToken = eLogin.data.data.token;
    const eConfig = { headers: { Authorization: `Bearer ${eToken}` } };

    // Create Product
    const cRes = await axios.post(`${BASE_URL}/inventory/categories`, { name: 'SubCat', description: 'desc' }, gConfig);
    const pRes = await axios.post(`${BASE_URL}/inventory/products`, {
        category_id: cRes.data.data.id, name: 'Milk', stock_quantity: 100, price_per_unit: 50, unit_type: 'L', quality_grade: 'A', is_organic: true, description: 'Fresh'
    }, gConfig);
    const pId = pRes.data.data.id;

    // 2. Gaushala creates Subscription Plan
    console.log('2. G creating Plan...');
    const planRes = await axios.post(`${BASE_URL}/subscription/plans`, {
        product_id: pId,
        name: 'Daily Fresh Milk',
        price_per_cycle: 50,
        frequency: 'DAILY',
        duration_days: 30
    }, gConfig);
    const planId = planRes.data.data.id;
    console.log('   Plan Created:', planRes.data.data.name);

    // 3. E subscribes
    console.log('3. E Subscribing...');
    const subRes = await axios.post(`${BASE_URL}/subscription/subscribe`, {
        plan_id: planId
    }, eConfig);
    console.log('   Subscribed! Status:', subRes.data.data.status);

    // 4. Verify Subscription List
    console.log('4. E Verifying My Subscriptions...');
    const mySubs = await axios.get(`${BASE_URL}/subscription/my`, eConfig);
    console.log('   My Subs Count:', mySubs.data.data.length);

    if (mySubs.data.data.length !== 1) throw new Error('Subscription count mismatch');

    console.log('--- Module 14 Verification SUCCESS ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testModule14();
