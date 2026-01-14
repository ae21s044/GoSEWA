const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testModule11() {
  try {
    console.log('--- Starting Module 11 Verification ---');

    console.log('1. Setup context (Logistics flow)...');
    
    // Reuse typical flow: G & E, Product, Buy, Pay, Ship
    const TS = Date.now();
    
    // Register G
    await axios.post(`${BASE_URL}/auth/register`, { email: `g_trk_${TS}@t.com`, password: 'Pass', phone: `98${TS.toString().slice(-8)}`, user_type: 'GAUSHALA' });
    const gLog = await axios.post(`${BASE_URL}/auth/login`, { email: `g_trk_${TS}@t.com`, password: 'Pass' });
    const gToken = gLog.data.data.token;
    const gConfig = { headers: { Authorization: `Bearer ${gToken}` } };

    // Register E
    await axios.post(`${BASE_URL}/auth/register`, { email: `e_trk_${TS}@t.com`, password: 'Pass', phone: `99${TS.toString().slice(-8)}`, user_type: 'ENTREPRENEUR' });
    const eLog = await axios.post(`${BASE_URL}/auth/login`, { email: `e_trk_${TS}@t.com`, password: 'Pass' });
    const eToken = eLog.data.data.token;
    const eConfig = { headers: { Authorization: `Bearer ${eToken}` } };

    // Product with PLENTY STOCK to avoid "Insufficient stock" errors
    const cRes = await axios.post(`${BASE_URL}/inventory/categories`, { name: `CatTrk`, description: 'D' }, gConfig);
    const pRes = await axios.post(`${BASE_URL}/inventory/products`, {
        category_id: cRes.data.data.id, name: 'TrackItem', stock_quantity: 1000, price_per_unit: 10, unit_type: 'KG', quality_grade: 'A', is_organic: true, description: 'Desc'
    }, gConfig);
    const pId = pRes.data.data.id;

    // Buy
    await axios.post(`${BASE_URL}/profile/addresses`, { address_type: "SHIPPING", street_address: "S", city: "C", state: "S", postal_code: "1" }, eConfig);
    await axios.post(`${BASE_URL}/orders/cart/items`, { product_id: pId, quantity: 1 }, eConfig);
    
    // Use saved address
    const eProf = await axios.get(`${BASE_URL}/profile`, eConfig);
    const addrId = eProf.data.data.Addresses[0].id;

    const eCheck = await axios.post(`${BASE_URL}/orders/checkout`, { shipping_address_id: addrId, billing_address_id: addrId }, eConfig);
    const oId = eCheck.data.data.id;

    // Pay
    await axios.post(`${BASE_URL}/payments/process`, { order_id: oId, payment_method: 'UPI', amount: eCheck.data.data.total_amount }, eConfig);

    // Ship
    const shipRes = await axios.post(`${BASE_URL}/logistics/book`, {
        order_id: oId, carrier: 'BlueDart', service: 'Express'
    }, gConfig);
    const shipmentId = shipRes.data.data.id;
    console.log('   Shipment Created:', shipmentId);

    // 2. Add Tracking Update (e.g. at Hub)
    console.log('2. Adding Tracking Update...');
    await axios.post(`${BASE_URL}/tracking/update`, {
        shipment_id: shipmentId,
        status: 'IN_TRANSIT',
        location: 'Mumbai Hub',
        description: 'Package arrived at sorting facility'
    }); // No Auth for webhook simulation
    console.log('   Update Added.');

    // 3. View Timeline
    console.log('3. Viewing Timeline...');
    const trackRes = await axios.get(`${BASE_URL}/tracking/${shipmentId}`);
    const timeline = trackRes.data.data.timeline;
    console.log('   Status:', trackRes.data.data.shipment.status);
    console.log('   Timeline Length:', timeline.length);
    console.log('   Latest Event:', timeline[0].description);

    if (trackRes.data.data.shipment.status !== 'IN_TRANSIT') throw new Error('Shipment status not synced');

    // 4. Verify Notification Received by Entrepreneur
    // (Optional, assuming Module 8 works)

    console.log('--- Module 11 Verification SUCCESS ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testModule11();
