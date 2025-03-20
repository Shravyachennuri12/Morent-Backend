require("dotenv").config(); // Load environment variables from .env
const twilio = require("twilio");

// Load Twilio credentials from .env
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Create Twilio client
const client = new twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (phone, otp) => {
  try {
    console.log("⚡ Sending SMS to:", phone);
    console.log("Message Content:", otp);
    
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    });

    console.log("✅ SMS Sent Successfully:", response.sid);
    return { success: true, response };
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    return { success: false, error: error.message };
  }
};


// Export the sendSMS function
module.exports = sendSMS;