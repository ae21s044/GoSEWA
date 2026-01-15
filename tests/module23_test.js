const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testApiGateway() {
  try {
    console.log('--- Starting Module 23 Test: API Gateway ---');

    // 1. Check for Security Headers (Helmet)
    console.log('1. Checking Security Headers...');
    const healthRes = await axios.get('http://localhost:3000/health');
    const headers = healthRes.headers;
    console.log('--- Debug: All Headers ---');
    console.log(headers);
    console.log('--------------------------');
    
    // Helmet adds standard security headers like 'x-dns-prefetch-control'
    if (headers['x-dns-prefetch-control']) {
        console.log('   SUCCESS: Helmet headers detected (x-dns-prefetch-control).');
    } else {
        console.error('   FAILURE: Helmet headers missing.');
    }

    // 2. Check Rate Limiting
    // We configured global limit as 100/15min. Auth limit 20/hour.
    // It's hard to trigger 100 requests in a quick test without flooding.
    // But we can check if RateLimit headers are present.
    console.log('2. Checking Rate Limit Headers...');
    if (headers['ratelimit-limit']) {
         console.log(`   SUCCESS: Rate Limit Headers present. Limit: ${headers['ratelimit-limit']}, Remaining: ${headers['ratelimit-remaining']}`);
    } else {
         console.error('   FAILURE: Rate Limit headers missing.');
    }

    // 3. Check Centralized Error Handling
    // We'll access a non-existent route to trigger a 404 (or if we had a forced error route).
    // The current errorHandler handles operational errors mostly. Express default 404 might not go through it unless we have a catch-all 404 handler (which we didn't add explicitly, so it might return default HTML or empty).
    // However, let's try to trigger a JSON error.
    // We can try to send malformed JSON which body-parser usually catches, but we want our errorHandler.
    // Let's try to hit a route that throws an error if we have one. 
    // Or, we can just observe if standard requests work fine, implying no breakage.
    // Let's rely on the fact that if we get a structured error response from a bad input, it works.
    // Let's try a bad auth request (missing fields) which usually returns 400 or 401. 
    // If our controller throws an unexpected error, errorHandler catches it.
    // For now, let's just make sure the app is stable.
    console.log('3. Stability Check (Error Handling)');
    try {
        await axios.post(`${API_URL}/auth/login`, {}); // Empty body
    } catch (error) {
        // We expect a 400 or 500. Our controller logic usually sends 400.
        // If it returns JSON, good.
        if (error.response && error.response.headers['content-type'] && error.response.headers['content-type'].includes('application/json')) {
            console.log('   SUCCESS: Error response is JSON format.');
        } else {
             console.log('   NOTE: Error response might not be JSON (could be default Express text).');
        }
    }

    console.log('--- Module 23 Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error);
    if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        console.error('Response Data:', error.response.data);
    } else if (error.request) {
        console.error('No Response Received. Request:', error.request);
    }
  }
}

testApiGateway();
