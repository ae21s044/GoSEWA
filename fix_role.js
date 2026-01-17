const { User, sequelize } = require('./src/models');

async function run() {
    try {
        await sequelize.authenticate();
        const email = 'subagent@test.com'; // User identified by browser check
        
        console.log(`Finding user: ${email}`);
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            console.error('User not found!');
            // Fallback: try to find the 'User' seen in screenshot if email match failed?
            // But subagent was confident.
            return;
        }

        console.log(`Current Role: ${user.user_type}`);
        
        if (user.user_type !== 'GAUSHALA') {
            user.user_type = 'GAUSHALA';
            await user.save();
            console.log(`Updated Role to: ${user.user_type}`);
        } else {
            console.log('User is already GAUSHALA.');
        }

    } catch (err) {
        console.error(err);
    }
}
run();
