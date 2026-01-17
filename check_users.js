const { User, sequelize } = require('./src/models');

async function run() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        console.log("Found Users:", users.length);
        users.forEach(u => {
            console.log(`ID: ${u.id}, Name: ${u.full_name}, Email: ${u.email}, Role: ${u.user_type}`);
        });
    } catch (err) {
        console.error(err);
    }
}
run();
