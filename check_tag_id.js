const { Cattle, sequelize } = require('./src/models');

async function checkTagId() {
    try {
        await sequelize.authenticate();
        
        const tagId = 'TEST_FAIL_REPRO_01';
        console.log(`Checking for Tag ID: ${tagId}`);
        
        const cattle = await Cattle.findOne({ where: { tag_id: tagId } });
        
        if (cattle) {
            console.log('\n✓ Record EXISTS in database:');
            console.log(`  ID: ${cattle.id}`);
            console.log(`  Tag ID: ${cattle.tag_id}`);
            console.log(`  Type: ${cattle.type}`);
            console.log(`  Breed: ${cattle.breed || '(empty)'}`);
            console.log(`  Status: ${cattle.current_status}`);
            console.log(`  Gaushala ID: ${cattle.gaushala_id}`);
            console.log(`  Created: ${cattle.created_at}`);
        } else {
            console.log('\n✗ Record NOT FOUND in database');
        }
        
        await sequelize.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkTagId();
