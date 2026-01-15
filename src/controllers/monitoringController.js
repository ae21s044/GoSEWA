const os = require('os');
const { sequelize } = require('../models');

exports.getSystemMetrics = (req, res) => {
    try {
        const uptime = os.uptime();
        const loadAvg = os.loadavg(); // Returns [1, 5, 15] min averages
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        const memoryUsage = process.memoryUsage(); // Node.js process memory

        res.json({
            success: true,
            data: {
                uptime_seconds: uptime,
                os: {
                    platform: os.platform(),
                    release: os.release(),
                    cpu_arch: os.arch(),
                    cpus: os.cpus().length,
                    load_avg: loadAvg
                },
                memory: {
                    total_system_bytes: totalMem,
                    free_system_bytes: freeMem,
                    used_system_bytes: usedMem,
                    process_heap_used: memoryUsage.heapUsed,
                    process_rss: memoryUsage.rss
                },
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getHealthCheck = async (req, res) => {
    try {
        // Deep check: Database
        let dbStatus = 'Unknown';
        try {
            await sequelize.authenticate();
            dbStatus = 'Connected';
        } catch (e) {
            dbStatus = 'Disconnected';
        }

        res.json({
            success: true,
            data: {
                status: 'Healthy', // Aggregate status
                checks: {
                    database: {
                        status: dbStatus,
                        dialect: sequelize.getDialect()
                    },
                    api_server: {
                        status: 'Running',
                        uptime: process.uptime()
                    }
                },
                timestamp: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
