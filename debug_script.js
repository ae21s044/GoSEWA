const { User, Cattle, sequelize } = require('./src/models');

async function run() {
    try {
        console.log("Authenticating DB...");
        await sequelize.authenticate();

        console.log("Finding a User...");
        const user = await User.findOne();
        if (!user) {
            console.error("No users found! creating one/cannot test.");
            const newUser = await User.create({
                 name: 'TestUser',
                 email: 'test@example.com',
                 password: 'password', // might need hashing but for FK it's fine
                 role: 'GAUSHALA'
            });
            console.log("Created Test User:", newUser.id);
            // use newUser
            return testCattle(newUser.id);
        }
        console.log("Found User ID:", user.id);
        await testCattle(user.id);

    } catch (err) {
        console.error("General Error:", err);
    }
}

async function testCattle(userId) {
    console.log("\n--- TEST 1: EMPTY STRING RFID ---");
    try {
        const res = await Cattle.create({
            gaushala_id: userId,
            tag_id: "DebugScriptTest01_" + Date.now(),
            type: "COW",
            breed: "DebugBreed",
            age: 4,
            gender: "FEMALE",
            current_status: "MILKING",
            rfid_tag: "", // TESTING EMPTY STRING
            lactation_number: 1,
            entry_type: 'BIRTH',
            entry_date: new Date()
        });
        console.log("Creation SUCCESS with EMPTY STRING! ID:", res.id);
    } catch (e) {
        console.error("Creation FAILED with EMPTY STRING:", e.message);
        // console.error(e);
    }

    console.log("\n--- TEST 2: NULL RFID ---");
    try {
        const res = await Cattle.create({
            gaushala_id: userId,
            tag_id: "DebugScriptTest02_" + Date.now(),
            type: "COW",
            breed: "DebugBreed",
            age: 4,
            gender: "FEMALE",
            current_status: "MILKING",
            rfid_tag: null, // TESTING NULL
            lactation_number: 1,
            entry_type: 'BIRTH',
            entry_date: new Date()
        });
        console.log("Creation SUCCESS with NULL! ID:", res.id);
    } catch (e) {
        console.error("Creation FAILED with NULL:", e.message);
    }
    
    console.log("\n--- TEST 3: DUPLICATE EMPTY STRING RFID ---");
    try {
        const res = await Cattle.create({
            gaushala_id: userId,
            tag_id: "DebugScriptTest03_" + Date.now(),
            type: "COW",
            breed: "DebugBreed",
            age: 4,
            gender: "FEMALE",
            current_status: "MILKING",
            rfid_tag: "", // TESTING SECOND EMPTY STRING
            lactation_number: 1,
            entry_type: 'BIRTH',
            entry_date: new Date()
        });
        console.log("Creation SUCCESS with 2nd EMPTY STRING! ID:", res.id);
    } catch (e) {
         console.error("Creation FAILED with 2nd EMPTY STRING:", e.message);
    }

}

run();
