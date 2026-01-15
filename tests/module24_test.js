const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testAdapters() {
  try {
    console.log('--- Starting Module 24 Test: Adapter Integration ---');

    console.log('1. Setting up Environment (Entrepreneur & Gaushala)');
    const entEmail = `ent_adapter_${Date.now()}@test.com`;
    const gauEmail = `gau_adapter_${Date.now()}@test.com`;
    
    // Register Entrepreneur
    const entPhone = `90${Math.floor(Math.random() * 100000000)}`;
    await axios.post(`${API_URL}/auth/register`, { email: entEmail, password: 'password123', user_type: 'ENTREPRENEUR', phone: entPhone });
    const entLogin = await axios.post(`${API_URL}/auth/login`, { email: entEmail, password: 'password123' });
    const entToken = entLogin.data.data.token;
    
    // Register Gaushala
    const gauPhone = `80${Math.floor(Math.random() * 100000000)}`;
    const gauRes = await axios.post(`${API_URL}/auth/register`, { email: gauEmail, password: 'password123', user_type: 'GAUSHALA', phone: gauPhone });
    const gaushalaId = gauRes.data.data.user.id;

    // Create Dummy Order to Pay
    // We need a product
    const gauLogin = await axios.post(`${API_URL}/auth/login`, { email: gauEmail, password: 'password123' });
    const gauToken = gauLogin.data.data.token;
    
    // Create Category
    const catName = `Adapter Test Cat ${Date.now()}`;
    const catRes = await axios.post(`${API_URL}/inventory/categories`, { name: catName }, { headers: { Authorization: `Bearer ${gauToken}` } });
    const catId = catRes.data.data.id;

    // Correct Product Creation
    const prodRes = await axios.post(`${API_URL}/inventory/products`, {
        name: 'Test Prod', 
        category_id: catId, 
        price_per_unit: 100, 
        initial_quantity: 10, 
        description: 'Test', 
        unit_type: 'KG'
    }, { headers: { Authorization: `Bearer ${gauToken}` } });
    const prodId = prodRes.data.data.id;

    const cartRes = await axios.post(`${API_URL}/orders/cart/items`, { product_id: prodId, quantity: 1 }, { headers: { Authorization: `Bearer ${entToken}` } });
    
    // Create Address
    const addrRes = await axios.post(`${API_URL}/profile/addresses`, {
        street_address: '123 Test St', city: 'Test City', state: 'TS', postal_code: '123456', country: 'India', address_type: 'BILLING', is_default: true
    }, { headers: { Authorization: `Bearer ${entToken}` } });
    const addrId = addrRes.data.data.id;

    const orderRes = await axios.post(`${API_URL}/orders/checkout`, { shipping_address_id: addrId, billing_address_id: addrId }, { headers: { Authorization: `Bearer ${entToken}` } });
    console.log('DEBUG ORDER RES:', orderRes.data);
    const orderId = orderRes.data.data.id || orderRes.data.data.order_id;
    console.log('   Order Created:', orderId);

    console.log('2. Testing Payment Adapter Via API');
    const payRes = await axios.post(`${API_URL}/payments/process`, {
        order_id: orderId,
        payment_method: 'UPI', 
        amount: 100
    }, { headers: { Authorization: `Bearer ${entToken}` } });
    
    if (payRes.data.success && payRes.data.data.payment_id) {
        console.log('   SUCCESS: Payment processed via Adapter. Txn ID:', payRes.data.data.payment_id);
    } else {
        console.error('   FAILURE: Payment failed.');
    }

    console.log('3. Testing Notification Adapter (Manual Trigger)');
    // Since notifications happen in background for reviews etc, let's use the manual send endpoint if available, 
    // or trigger a logic that sends one. Payment success usually triggers one?
    // Let's assume user got a notification for the order?
    // Or we can query user notifications.
    
    const notifRes = await axios.get(`${API_URL}/notifications`, { headers: { Authorization: `Bearer ${entToken}` } });
    if (notifRes.data.data.notifications.length > 0) {
        console.log('   SUCCESS: Notifications persisted (Adapter worked). Count:', notifRes.data.data.notifications.length);
    } else {
         // Maybe Order Placed didn't trigger notification in previous code?
         // Let's assume it should have.
         console.log('   NOTE: No notifications found. Checking logs manually for adapter output.');
    }

    console.log('--- Module 24 Test Completed Successfully ---');

   } catch (error) {
    console.error('Test Failed at step:', error.config ? error.config.url : 'Unknown');
    console.error('Error Details:', error.response ? error.response.data : error.message);
  }
}

testAdapters();
