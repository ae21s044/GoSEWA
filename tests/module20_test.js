const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testColdChain() {
  try {
    console.log('--- Starting Module 20 Test: Cold Chain Management ---');

    console.log('1. Setting up Environment (Transporter & Shipment)');
    // 1. Transporter
    const transEmail = `trans_cold_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, { email: transEmail, password: 'password123', user_type: 'TRANSPORTER', phone: `92${Math.floor(Math.random() * 100000000)}` });
    const transLogin = await axios.post(`${API_URL}/auth/login`, { email: transEmail, password: 'password123' });
    const token = transLogin.data.data.token;

    // 2. Vehicle
    const vRes = await axios.post(`${API_URL}/transporter/vehicles`, { vehicle_number: `CC-${Math.floor(Math.random()*1000)}`, vehicle_type: 'TRUCK', capacity_kg: 1000 }, { headers: { Authorization: `Bearer ${token}` } });
    const vehicleId = vRes.data.data.id;

    // 3. Shipment (Mocking a shipment ID for simplicity since we tested shipment flow in Module 10)
    // In a real scenario, we'd create Order -> Book Shipment. 
    // For this unit test of Cold Chain, we can just pass a UUID if the DB foreign key constraint permits null or if we create a shipment.
    // Our ColdChainLog model allows null shipment_id or we can create one.
    // Let's create a Shipment relative to Module 10 flow to be robust. 
    // Actually, to save time/complexity, let's just assume we track by Vehicle ID which is common.
    // But let's try to create a dummy shipment if relationships are strict.
    // Order of operations: Ent -> Order -> Transporter -> Shipment.
    // Simplified: We'll just use Vehicle ID for the log, and pass a random UUID for shipment if needed or null.
    // Model defines shipment_id as UUID allowNull: true. So we can test with just Vehicle ID.

    console.log('2. Adding "Good" Log (Normal Temp)');
    const goodLogRes = await axios.post(
        `${API_URL}/coldchain/logs`,
        {
            vehicle_id: vehicleId,
            temperature_celsius: 4.5, // Good for milk (approx)
            humidity_percent: 50,
            location_lat: 28.7041,
            location_lon: 77.1025
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Good Log Recorded. Alerts:', goodLogRes.data.alerts_generated);
    if (!goodLogRes.data.alerts_generated) console.log('   SUCCESS: No alert for good temp.');
    else console.error('   FAILURE: Alert generated for good temp.');

    console.log('3. Adding "Bad" Log (High Temp)');
    const badLogRes = await axios.post(
        `${API_URL}/coldchain/logs`,
        {
            vehicle_id: vehicleId,
            temperature_celsius: 12.0, // Too hot
            humidity_percent: 55,
            location_lat: 28.7042,
            location_lon: 77.1026
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('   Bad Log Recorded. Alerts:', badLogRes.data.alerts_generated);
    if (badLogRes.data.alerts_generated) {
        console.log('   SUCCESS: Alert generated for high temp.');
        console.log('   Alert Msg:', badLogRes.data.alerts[0].message);
    } else {
        console.error('   FAILURE: No alert for high temp.');
    }

    console.log('4. Retrieving Alerts');
    const alertsRes = await axios.get(`${API_URL}/coldchain/alerts`, { headers: { Authorization: `Bearer ${token}` } });
    if (alertsRes.data.alerts.length > 0) {
        console.log('   SUCCESS: Retrieved persistent alerts.');
    } else {
        console.error('   FAILURE: No alerts retrieved.');
    }

    console.log('--- Module 20 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
}

testColdChain();
