/**
 * Payment Adapter Service
 * Acts as a standardized interface for different payment gateways.
 * Currently simulates a mock gateway.
 */

class PaymentAdapter {
    constructor(provider = 'MOCK') {
        this.provider = provider;
    }

    /**
     * Process a transaction
     * @param {Object} details - { amount, currency, method, description }
     * @returns {Promise<Object>} - { success, transactionId, rawResponse }
     */
    async processTransaction(details) {
        console.log(`[PaymentAdapter:${this.provider}] Processing transaction:`, details);

        if (this.provider === 'MOCK') {
            return this._mockProcess(details);
        } else if (this.provider === 'RAZORPAY') {
            // Future implementation
            throw new Error('Razorpay provider not yet implemented');
        } else {
            throw new Error(`Unknown provider: ${this.provider}`);
        }
    }

    /**
     * Refund a transaction
     * @param {string} transactionId 
     * @param {number} amount 
     */
    async refundTransaction(transactionId, amount) {
        console.log(`[PaymentAdapter:${this.provider}] Refunding ${amount} for txn ${transactionId}`);
        // Mock logic
        return {
            success: true,
            refundId: `REF-${Date.now()}`,
            status: 'PROCESSED'
        };
    }

    // --- Mock Implementation Details ---
    async _mockProcess({ amount, method }) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate random failure (e.g., 5% chance)
        // For stable testing, we'll keep it 100% success unless specific flag passed
        const isSuccess = true; 

        if (isSuccess) {
            return {
                success: true,
                transactionId: `PAY-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                rawResponse: { status: 'captured', method }
            };
        } else {
            return {
                success: false,
                error: 'Simulated Gateway Failure'
            };
        }
    }
}

module.exports = new PaymentAdapter();
