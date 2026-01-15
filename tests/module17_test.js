const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testDemandForecasting() {
  try {
    console.log('--- Starting Module 17 Test: Demand Forecasting ---');

    // 1. Register a Gaushala
    const gaushalaEmail = `gaushala_forecast_${Date.now()}@test.com`;
    const password = 'password123';
    
    console.log('1. Registering Gaushala...');
    await axios.post(`${API_URL}/auth/register`, {
      email: gaushalaEmail,
      password: password,
      user_type: 'GAUSHALA',
      phone: `98${Math.floor(Math.random() * 100000000)}`
    });

    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: gaushalaEmail,
      password: password
    });
    
    const token = loginRes.data.data.token;
    const gaushalaId = loginRes.data.data.user.id;
    console.log('   Gaushala logged in. ID:', gaushalaId);

    // 2. Create a Product
    console.log('2. Creating a Product...');
    
    // Create Category first
    const categoryRes = await axios.post(
      `${API_URL}/inventory/categories`,
      { name: `Dairy_Forecast_${Date.now()}`, description: 'Milk products', icon_url: 'http://example.com/icon.png' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Category Response:', categoryRes.data);
    const categoryId = categoryRes.data.data.id;

    const productRes = await axios.post(
      `${API_URL}/inventory/products`,
      {
        name: 'Forecast Milk',
        description: 'Fresh milk for forecasting',
        price_per_unit: 50,
        stock_quantity: 100,
        category_id: categoryId, 
        unit_type: 'L',
        initial_quantity: 100
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const productId = productRes.data.data.id;
    console.log('   Product created. ID:', productId);

    // 3. Generate Forecasts
    console.log('3. Generating Forecasts...');
    try {
        const generateRes = await axios.post(
          `${API_URL}/forecast/generate`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Forecast generation response:', generateRes.data);
    } catch (err) {
        console.error('   Error generating forecasts:', err.response ? err.response.data : err.message);
        throw err;
    }

    // 4. Retrieve Forecasts
    console.log('4. Retrieving Forecasts...');
    const getRes = await axios.get(
      `${API_URL}/forecast/${gaushalaId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const forecasts = getRes.data;
    console.log(`   Retrieved ${forecasts.length} forecast entries.`);

    if (forecasts.length > 0) {
      console.log('   Sample Forecast:', forecasts[0]);
      if (forecasts[0].product_id === productId) {
        console.log('   SUCCESS: Forecast matches product ID.');
      } else {
        console.error('   FAILURE: Product ID mismatch.');
      }
    } else {
      console.error('   FAILURE: No forecasts retrieved.');
    }

    console.log('--- Module 17 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testDemandForecasting();
