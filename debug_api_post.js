const axios = require('axios');

async function run() {
    try {
        console.log("Sending POST to http://localhost:3000/api/v1/stock/livestock");
        // Mimic the frontend payload exactly
        const payload = {
            tag_id: "DebugApiTest05_" + Date.now(),
            rfid_tag: "", // EMPTY STRING
            type: "COW",
            breed: "Gir",
            age: 4,
            gender: "FEMALE",
            current_status: "MILKING",
            current_group: "Milking",
            lactation_number: 2,
            entry_type: "BIRTH",
            entry_date: new Date().toISOString().split('T')[0]
        };
        
        console.log("Payload:", payload);

        const res = await axios.post('http://localhost:3000/api/v1/stock/livestock', payload);
        console.log("Response Status:", res.status);
        console.log("Response Data:", res.data);

    } catch (error) {
        console.error("Request Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

run();
