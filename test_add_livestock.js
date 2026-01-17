const axios = require('axios');

async function testAddLivestock() {
    try {
        // First, let's try to get a valid token by logging in
        const loginResponse = await axios.post('http://localhost:3000/api/v1/auth/login', {
            email: 'subagent@test.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✓ Login successful, got token');
        
        // Now try to add a livestock with a unique tag
        const uniqueTag = `TEST_${Date.now()}`;
        console.log(`\n Attempting to add livestock with Tag ID: ${uniqueTag}`);
        
        const addResponse = await axios.post(
            'http://localhost:3000/api/v1/stock/livestock',
            {
                tag_id: uniqueTag,
                type: 'COW',
                breed: 'Test Breed',
                age: 3,
                gender: 'FEMALE',
                current_status: 'MILKING',
                lactation_number: 1
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✓ Add livestock successful!');
        console.log('Response:', JSON.stringify(addResponse.data, null, 2));
        
    } catch (error) {
        console.error('\n✗ Error occurred:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testAddLivestock();
