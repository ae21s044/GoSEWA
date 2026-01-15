const { Product, User, Address, Review, Category } = require('../models');
const { Op } = require('sequelize');

// Helper to calculate distance (Harversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

exports.findMatches = async (req, res) => {
    try {
        const { category_id, product_name, max_distance_km, min_rating, max_price, user_lat, user_lon } = req.body;
        
        // 1. Base Product Filter
        const productWhere = { is_available: true };
        if (category_id) productWhere.category_id = category_id;
        if (product_name) productWhere.name = { [Op.like]: `%${product_name}%` };
        if (max_price) productWhere.price_per_unit = { [Op.lte]: max_price };

        // 2. Fetch Potential Products with Gaushala Info
        const products = await Product.findAll({
            where: productWhere,
            include: [
                { 
                    model: User, 
                    as: 'Gaushala',
                    include: [
                        { model: Address }, // To get location
                        { model: Review, as: 'ReceivedReviews', attributes: ['rating'] } // To calc avg rating
                    ]
                }
            ]
        });

        // 3. Filter and Score
        let matches = products.map(product => {
            const gaushala = product.Gaushala;
            
            // Skip if no address (cannot calc distance) - strict mode
            // For MVP, if no address, we might assign a default "far" distance or skip
            const gAddr = gaushala.Addresses && gaushala.Addresses.length > 0 ? gaushala.Addresses[0] : null;

            let distance = 9999;
            if (user_lat != null && user_lon != null && gAddr && gAddr.latitude != null && gAddr.longitude != null) {
                distance = calculateDistance(user_lat, user_lon, gAddr.latitude, gAddr.longitude);
            }

            // Calculate Rating
            const reviews = gaushala.ReceivedReviews || [];
            const avgRating = reviews.length > 0 
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
                : 0;
            
            // Apply Filters (Distance & Rating)
            if (max_distance_km && distance > max_distance_km) {
                return null;
            }
            if (min_rating && avgRating < min_rating) {
                return null;
            }

            // Scoring Formula (Simple Weighted Sum)
            // Lower Price is better, Lower Distance is better, Higher Rating is better
            // Normalize these values roughly to 0-100 scale for scoring
            
            // Price Score: Map 0-max_price to 100-0. (Inverted: expensive = low score)
            const priceScore = max_price ? Math.max(0, 100 - (product.price_per_unit / max_price * 100)) : 50; 
            
            // Distance Score: Map 0-max_dist to 100-0
            const distScore = max_distance_km ? Math.max(0, 100 - (distance / max_distance_km * 100)) : 50;

            // Rating Score: Map 0-5 to 0-100
            const ratingScore = (avgRating / 5) * 100;

            // Weights: Distance 40%, Price 30%, Rating 30%
            const totalScore = (distScore * 0.4) + (priceScore * 0.3) + (ratingScore * 0.3);

            return {
                product,
                gaushala_name: gaushala.email, // using email as name proxy if full_name unavailable on user root
                distance_km: parseFloat(distance.toFixed(2)),
                rating: parseFloat(avgRating.toFixed(1)),
                match_score: parseFloat(totalScore.toFixed(2))
            };
        }).filter(item => item !== null);

        // 4. Sort by Score Descending
        matches.sort((a, b) => b.match_score - a.match_score);

        res.json({
            success: true,
            count: matches.length,
            matches
        });

    } catch (error) {
        console.error('Error finding matches:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
