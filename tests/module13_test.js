const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testModule13() {
  try {
    console.log('--- Starting Module 13 Verification ---');

    console.log('1. Setup context (E & G)...');
    const TS = Date.now();
    
    // Register E (Buyer)
    const eEmail = `e_bulk_${TS}@t.com`;
    await axios.post(`${BASE_URL}/auth/register`, { email: eEmail, password: 'Pass', phone: `98${TS.toString().slice(-8)}`, user_type: 'ENTREPRENEUR' });
    const eLogin = await axios.post(`${BASE_URL}/auth/login`, { email: eEmail, password: 'Pass' });
    const eToken = eLogin.data.data.token;
    const eConfig = { headers: { Authorization: `Bearer ${eToken}` } };

    // Register G (Seller)
    const gEmail = `g_bulk_${TS}@t.com`;
    await axios.post(`${BASE_URL}/auth/register`, { email: gEmail, password: 'Pass', phone: `99${TS.toString().slice(-8)}`, user_type: 'GAUSHALA' });
    const gLogin = await axios.post(`${BASE_URL}/auth/login`, { email: gEmail, password: 'Pass' });
    const gToken = gLogin.data.data.token;
    const gConfig = { headers: { Authorization: `Bearer ${gToken}` } };

    // Create Product (for linking)
    const cRes = await axios.post(`${BASE_URL}/inventory/categories`, { name: 'BulkCat', description: 'desc' }, gConfig);
    const pRes = await axios.post(`${BASE_URL}/inventory/products`, {
        category_id: cRes.data.data.id, name: 'BulkItem', stock_quantity: 1000, price_per_unit: 50, unit_type: 'KG', quality_grade: 'B', is_organic: true, description: 'Bulk'
    }, gConfig);
    const pId = pRes.data.data.id;

    // 2. Entrepreneur creates Request
    console.log('2. E creating Bulk Request...');
    const reqRes = await axios.post(`${BASE_URL}/bulk/request`, {
        category_id: cRes.data.data.id,
        product_id: pId,
        quantity_required: 500,
        target_price_per_unit: 40,
        description: 'Need 500kg for composting'
    }, eConfig);
    const requestId = reqRes.data.data.id;
    console.log('   Request ID:', requestId);

    // 3. Gaushala views and quotes
    console.log('3. G Viewing & Quoting...');
    const openRes = await axios.get(`${BASE_URL}/bulk/requests`, gConfig);
    if(openRes.data.data.length === 0) throw new Error('No open requests found');
    
    const quoteRes = await axios.post(`${BASE_URL}/bulk/quote`, {
        bulk_request_id: requestId,
        price_per_unit: 45, // Negotiation: 45 vs target 40
        message: 'Best I can do is 45'
    }, gConfig);
    const quoteId = quoteRes.data.data.id;
    console.log('   Quote Submitted:', quoteId, 'Amount:', quoteRes.data.data.total_amount);

    // 4. Entrepreneur accepts quote
    console.log('4. E Accepting Quote...');
    
    // View quotes first
    const viewQuotes = await axios.get(`${BASE_URL}/bulk/request/${requestId}/quotes`, eConfig);
    console.log('   Quotes found:', viewQuotes.data.data.length);

    // Accept
    const acceptRes = await axios.post(`${BASE_URL}/bulk/accept`, { quote_id: quoteId }, eConfig);
    console.log('   Accepted. Order ID:', acceptRes.data.data.id);

    // 5. Verify Order Created
    // (Needs Auth for specific order)
    try {
        await axios.get(`${BASE_URL}/orders/${acceptRes.data.data.id}`, eConfig);
        console.log('   Order Verification: Found.');
    } catch(e) {
        throw new Error('Created Order not found');
    }

    console.log('--- Module 13 Verification SUCCESS ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testModule13();
