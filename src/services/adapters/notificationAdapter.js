/**
 * Notification Adapter Service
 * Standard interface for sending SMS, Email, and Push notifications.
 */

class NotificationAdapter {
    constructor(provider = 'MOCK') {
        this.provider = provider;
    }

    async sendSMS(phoneNumber, message) {
        console.log(`[NotificationAdapter:${this.provider}] Sending SMS to ${phoneNumber}: ${message}`);
        // In real app: await twilio.messages.create(...)
        return { success: true, messageId: `SMS-${Date.now()}` };
    }

    async sendEmail(email, subject, body) {
        console.log(`[NotificationAdapter:${this.provider}] Sending Email to ${email}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Body: ${body}`);
        // In real app: await sendgrid.send(...)
        return { success: true, messageId: `EMAIL-${Date.now()}` };
    }

    async sendPush({ userId, title, message, metadata }) {
        console.log(`[NotificationAdapter:${this.provider}] Sending Push to User ${userId}`);
        console.log(`   ${title}: ${message}`);
        // In real app: await firebase.messaging().send(...)
        return { success: true, messageId: `PUSH-${Date.now()}` };
    }
}

module.exports = new NotificationAdapter();
