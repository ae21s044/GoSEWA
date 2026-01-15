const { Cattle, HealthRecord, MilkProductionLog } = require('../models');

// --- Cattle Management ---

exports.addCattle = async (req, res) => {
    try {
        const { tag_id, name, breed, dob, gender, health_status, milking_status } = req.body;
        
        // Validation: Check if tag_id already exists? (Enforced by DB unique constraint, but could check here)
        
        const cattle = await Cattle.create({
            gaushala_id: req.user.id,
            tag_id,
            name,
            breed,
            dob,
            gender,
            health_status,
            milking_status
        });

        res.status(201).json({ success: true, message: 'Cattle registered successfully', data: cattle });

    } catch (error) {
        console.error('Error adding cattle:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCattle = async (req, res) => {
    try {
        const cattleList = await Cattle.findAll({
            where: { gaushala_id: req.user.id },
            include: [
                { model: HealthRecord, limit: 1, order: [['date', 'DESC']] }, 
                { model: MilkProductionLog, limit: 1, order: [['date', 'DESC']] }
            ]
        });
        res.json({ success: true, count: cattleList.length, data: cattleList });
    } catch (error) {
        console.error('Error fetching cattle:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Health Records ---

exports.addHealthRecord = async (req, res) => {
    try {
        const { id } = req.params; // Cattle ID
        const { record_type, description, doctor_name, cost, date, next_due_date } = req.body;

        // Verify ownership
        const cattle = await Cattle.findOne({ where: { id, gaushala_id: req.user.id } });
        if (!cattle) return res.status(404).json({ success: false, message: 'Cattle not found' });

        const record = await HealthRecord.create({
            cattle_id: id,
            record_type,
            description,
            doctor_name,
            cost,
            date,
            next_due_date
        });

        // Update cattle status if needed (e.g. if Sick)
        // For simple logic, if record_type is TREATMENT, maybe set status to SICK?
        // Let's keep it manual for now via updateCattle endpoint (omitted for brevity) or passed in body.

        res.status(201).json({ success: true, message: 'Health record added', data: record });

    } catch (error) {
        console.error('Error adding health record:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Milk Production ---

exports.logMilkProduction = async (req, res) => {
    try {
        const { id } = req.params; // Cattle ID
        const { date, morning_yield_liters, evening_yield_liters, fat_percentage } = req.body;

         // Verify ownership
         const cattle = await Cattle.findOne({ where: { id, gaushala_id: req.user.id } });
         if (!cattle) return res.status(404).json({ success: false, message: 'Cattle not found' });

         const log = await MilkProductionLog.create({
             cattle_id: id,
             date,
             morning_yield_liters: morning_yield_liters || 0,
             evening_yield_liters: evening_yield_liters || 0,
             fat_percentage
         });

         res.status(201).json({ success: true, message: 'Milk production logged', data: log });

    } catch (error) {
        console.error('Error logging milk production:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
