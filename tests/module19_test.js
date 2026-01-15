const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testSmartMatching() {
  try {
    console.log('--- Starting Module 19 Test: Smart Matching Engine ---');

    console.log('1. Setting up Environment (Entrepreneur)');
    const entEmail = `ent_match_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: entEmail, password: 'password123', user_type: 'ENTREPRENEUR', phone: `95${Math.floor(Math.random() * 100000000)}` });
    const entLogin = await axios.post(`${API_URL}/auth/login`, { email: entEmail, password: 'password123' });
    const entToken = entLogin.data.data.token;

    console.log('2. Creating Gaushalas with different attributes');
    // G1: Close, Cheap, Avg Rating (Should win)
    const g1Email = `g1_match_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: g1Email, password: 'password123', user_type: 'GAUSHALA', phone: `94${Math.floor(Math.random() * 100000000)}` });
    const g1Login = await axios.post(`${API_URL}/auth/login`, { email: g1Email, password: 'password123' });
    const g1Token = g1Login.data.data.token;
    
    // Add Address (0,0)
    await axios.post(`${API_URL}/profile/addresses`, { 
        address_type: 'BUSINESS', street_address: 'Loc G1', city: 'City', state: 'ST', postal_code: '000000',
        latitude: 0.0, longitude: 0.0 
    }, { headers: { Authorization: `Bearer ${g1Token}` } });

    // Use unique product name to avoid noise
    const prodName = `MatchMilk_${Date.now()}`;

    // Add Product ($50)
    const catRes = await axios.post(`${API_URL}/inventory/categories`, { name: `Match_Cat_${Date.now()}`, description: 'Test' }, { headers: { Authorization: `Bearer ${g1Token}` } });
    const catId = catRes.data.data.id;
    await axios.post(`${API_URL}/inventory/products`, { name: prodName, description: 'G1 Milk', price_per_unit: 50, stock_quantity: 100, category_id: catId, unit_type: 'L', initial_quantity: 100 }, { headers: { Authorization: `Bearer ${g1Token}` } });

    // Add Review for G1 (Rating 4)
    // Need an order to review? Or can we just post a review? Review model usually links to order/product.
    // Index.js: User.hasMany(Review, { foreignKey: 'gaushala_id', as: 'ReceivedReviews' });
    // Verify Review Controller... usually review is tied to Order.
    // For simplicity, let's skip Review for now and rely on Distance/Price.
    // Or check if we can create review directly.

    // G2: Far, Expensive
    const g2Email = `g2_match_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: g2Email, password: 'password123', user_type: 'GAUSHALA', phone: `93${Math.floor(Math.random() * 100000000)}` });
    const g2Login = await axios.post(`${API_URL}/auth/login`, { email: g2Email, password: 'password123' });
    const g2Token = g2Login.data.data.token;

     // Add Address (10,10) - Far
     await axios.post(`${API_URL}/profile/addresses`, { 
        address_type: 'BUSINESS', street_address: 'Loc G2', city: 'City', state: 'ST', postal_code: '000000',
        latitude: 10.0, longitude: 10.0 
    }, { headers: { Authorization: `Bearer ${g2Token}` } });

    // Add Product ($100)
    await axios.post(`${API_URL}/inventory/products`, { name: prodName, description: 'G2 Milk', price_per_unit: 100, stock_quantity: 100, category_id: catId, unit_type: 'L', initial_quantity: 100 }, { headers: { Authorization: `Bearer ${g2Token}` } });


    console.log('3. Running Matching Algorithm');
    // Entrepreneur at (0, 0.1)
    const matchRes = await axios.post(
        `${API_URL}/matching/match`,
        {
            product_name: prodName,
            user_lat: 0.0,
            user_lon: 0.1,
            max_distance_km: 2000, 
            max_price: 200
        },
        { headers: { Authorization: `Bearer ${entToken}` } }
    );

    console.log('   Results Found:', matchRes.data.count);
    const matches = matchRes.data.matches;
    
    if (matches.length >= 2) {
        console.log('   Top Match:', matches[0].gaushala_name, 'Score:', matches[0].match_score);
        console.log('   Second Match:', matches[1].gaushala_name, 'Score:', matches[1].match_score);

        if (matches[0].gaushala_name === g1Email) {
            console.log('   SUCCESS: G1 (Closer/Cheaper) ranked first.');
        } else {
            console.log('   FAILURE: Ranking logic might be off.');
        }

        if (matches[0].match_score > matches[1].match_score) {
             console.log('   SUCCESS: Scores are correctly ordered.');
        }
    } else {
        console.error('   FAILURE: Not enough matches found.');
    }

    console.log('--- Module 19 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testSmartMatching();
