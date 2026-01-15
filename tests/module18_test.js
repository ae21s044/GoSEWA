const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testRouteOptimization() {
  try {
    console.log('--- Starting Module 18 Test: Route Optimization ---');

    console.log('1. Registering Transporter...');
    const transporterEmail = `transporter_route_${Date.now()}@test.com`;
    const password = 'password123';
    
    await axios.post(`${API_URL}/auth/register`, {
        email: transporterEmail,
        password: password,
        user_type: 'TRANSPORTER',
        phone: `98${Math.floor(Math.random() * 100000000)}`
    });

    const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: transporterEmail,
        password: password
    });
    const token = loginRes.data.data.token;
    const transporterId = loginRes.data.data.user.id;
    console.log('   Transporter registered and logged in.');

    // 2. Add a Vehicle
    console.log('2. Adding a Vehicle...');
    const vehicleRes = await axios.post(
        `${API_URL}/transporter/vehicles`,
        {
            vehicle_number: `DL-${Math.floor(Math.random() * 1000)}`,
            vehicle_type: 'TRUCK',
            capacity_kg: 5000,
            is_refrigerated: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    const vehicleId = vehicleRes.data.data.id;
    console.log('   Vehicle added. ID:', vehicleId);

    // 3. Create Dummy Orders (simulate orders assigned this transporter/gaushala)
    // For simplicity, we create an order flow or just assume we can optimize any orders if we pass IDs
    // But our controller checks Order existence. So we must create orders.
    // Creating orders requires Entrepreneur and Product.
    
    console.log('3. Creating Prerequisites (Entrepreneur, Product, Order)...');
    
    // Register Entrepreneur
    const entEmail = `ent_route_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: entEmail, password: 'password123', user_type: 'ENTREPRENEUR', phone: `97${Math.floor(Math.random() * 100000000)}` });
    const entLogin = await axios.post(`${API_URL}/auth/login`, { email: entEmail, password: 'password123' });
    const entToken = entLogin.data.data.token;

    // Register Gaushala & Product
    const gauEmail = `gau_route_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: gauEmail, password: 'password123', user_type: 'GAUSHALA', phone: `96${Math.floor(Math.random() * 100000000)}` });
    const gauLogin = await axios.post(`${API_URL}/auth/login`, { email: gauEmail, password: 'password123' });
    const gauToken = gauLogin.data.data.token;
    const gauId = gauLogin.data.data.user.id; // Corrected path

    // Create Category first (fix from module 17 learnings)
    const catRes = await axios.post(`${API_URL}/inventory/categories`, { name: `Dairy_Route_${Date.now()}`, description: 'Test' }, { headers: { Authorization: `Bearer ${gauToken}` } });
    const catId = catRes.data.data.id;

    const prodRes = await axios.post(`${API_URL}/inventory/products`, {
        name: 'Milk', description: 'Fresh', price_per_unit: 50, stock_quantity: 100, category_id: catId, unit_type: 'L', initial_quantity: 100
    }, { headers: { Authorization: `Bearer ${gauToken}` } });
    const prodId = prodRes.data.data.id;

    // Create Address for Entrepreneur
    const addressRes = await axios.post(`${API_URL}/profile/addresses`, {
        address_type: 'BUSINESS',
        street_address: '123 Market St',
        city: 'Delhi',
        state: 'DL',
        postal_code: '110001'
    }, { headers: { Authorization: `Bearer ${entToken}` } });
    const addressId = addressRes.data.data.id;
    console.log('   Address created. ID:', addressId);

    // Create 3 Orders
    const orderIds = [];
    for (let i = 0; i < 3; i++) {
        // Add to Cart
        await axios.post(`${API_URL}/orders/cart/items`, {
            product_id: prodId,
            quantity: 5
        }, { headers: { Authorization: `Bearer ${entToken}` } });

        // Checkout
        const orderRes = await axios.post(`${API_URL}/orders/checkout`, {
            shipping_address_id: addressId,
            billing_address_id: addressId
        }, { headers: { Authorization: `Bearer ${entToken}` } });

        orderIds.push(orderRes.data.data.id);
    }
    console.log('   Created 3 Orders:', orderIds);

    // 4. Optimize Route
    console.log('4. Optimizing Route...');
    const optimizeRes = await axios.post(
        `${API_URL}/routes/optimize`,
        {
            vehicle_id: vehicleId,
            order_ids: orderIds
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('   Route Optimized!');
    console.log('   Route ID:', optimizeRes.data.route.id);
    console.log('   Stops:', optimizeRes.data.stops.length);
    console.log('   Total Distance:', optimizeRes.data.route.total_distance_km, 'km');

    if (optimizeRes.data.stops.length === 3) {
        console.log('   SUCCESS: Route contains correct number of stops.');
    } else {
        console.error('   FAILURE: Incorrect number of stops.');
    }
    
    // 5. Get Route Details
    const routeId = optimizeRes.data.route.id;
    const detailRes = await axios.get(`${API_URL}/routes/${routeId}`, { headers: { Authorization: `Bearer ${token}` } });
    
    if (detailRes.data.id === routeId) {
         console.log('   SUCCESS: Route details retrieved.');
    } else {
         console.error('   FAILURE: Could not retrieve route details.');
    }

    console.log('--- Module 18 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testRouteOptimization();
