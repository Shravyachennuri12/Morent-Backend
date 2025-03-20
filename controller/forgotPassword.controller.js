const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../utils/sendSMS");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// const forgotPassword = async (req, res) => {
//     try {
//       const { email, phone } = req.body;
  
//       if (!email && !phone) {
//         return res.status(400).json({ message: "Please provide an email or phone number." });
//       }
  
//       const user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });
//       if (!user) {
//         return res.status(404).json({ message: "User not found." });
//       }
  
//       const otp = generateOTP();
//       user.otp = otp;
//       user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
//       await user.save();
  
//       if (email) {
//         await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);
//       }
  
//       res.status(200).json({ message: "OTP sent to your email." });
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   };
  
  // Verify OTP
  // const verifyOTP = async (req, res) => {
  //   try {
  //     const { email, phone, otp } = req.body;
  
  //     const user = await User.findOne({ $or: [{ email }, { phoneNumber: phone }] });
  //     if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
  //       return res.status(400).json({ message: "Invalid or expired OTP." });
  //     }
  
  //     user.otp = null;
  //     user.otpExpiry = null;
  //     await user.save();
  
  //     res.status(200).json({ message: "OTP verified. Proceed to reset password." });
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // };
 
// Forgot Password - Send OTP via Email or SMS

//my code 
// const forgotPassword = async (req, res) => {
//   try {
//     console.log("Request received with:", req.body);

//     const { email, phone } = req.body;

//     if (!email && !phone) {
//       console.log("No email or phone provided.");
//       return res
//         .status(400)
//         .json({ message: "Please provide an email or phone number." });
//     }

//     const normalizedPhone = phone; // No need for +91 here if stored without it
//     console.log("Normalized phone:", normalizedPhone);

//     // Check if user exists
//     const user = await User.findOne({
//       $or: [{ email }, { phoneNumber: phone }],
//     });

//     if (!user) {
//       console.log("User not found for:", { email, phone });
//       return res.status(404).json({ message: "User not found." });
//     }

//     console.log("User found:", user);

//     // Generate OTP
//     const otp = generateOTP();
//     console.log("Generated OTP:", otp);

//     user.otp = otp;
//     user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
//     await user.save();
//     console.log("OTP saved in database");

//     let messageSent = false;

//     // Send OTP via email if email is provided
//     if (email) {
//       console.log("Sending OTP to email:", email);
//       await sendEmail(user.email, "Password Reset OTP", `Your OTP is: ${otp}`);
//       messageSent = true;
//     }

//     // Send OTP via SMS if phone number is provided
//     if (phone) {
//       console.log("Sending OTP via SMS to:", normalizedPhone);
//       const smsResponse = await sendSMS(normalizedPhone, `Your OTP is: ${otp}`);
//       console.log("SMS Response:", smsResponse);

//       if (smsResponse.success) {
//         messageSent = true;
//       } else {
//         return res.status(500).json({ message: "Failed to send OTP via SMS." });
//       }
//     }

//     if (messageSent) {
//       console.log("OTP sent successfully.");
//       return res.status(200).json({ message: "OTP sent successfully." });
//     } else {
//       return res.status(500).json({ message: "Failed to send OTP." });
//     }
//   } catch (error) {
//     console.error("Error in forgotPassword:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

//git forgotcode
const forgotPassword = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
      return res.status(400).json({ message: 'Please provide either email or phone' });
  }

  try {
      let user;
      if (email) {
          user = await User.findOne({ email });
      } else {
          user = await User.findOne({ phone });
      }

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = Date.now() + 300000; // OTP expires in 5 minutes
      await user.save();

      console.log('Generated OTP:', otp);
      console.log('Stored OTP:', user.otp);
      console.log('OTP Expiry:', user.otpExpiry);

      if (email) {
          await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);
          console.log(`OTP sent to email: ${email}`);
      }

      if (phone) {
          await sendSMS(phone, otp);
          console.log(`OTP sent to phone: ${phone}`);
      }

      res.json({ message: 'OTP sent successfully to email and/or phone' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;



    const normalizedPhone = phone ? phone.replace(/^\+91/, "") : "";

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email }, { phoneNumber: normalizedPhone }],
    });
    
    

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Clear OTP and expiry after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

  

  const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      const user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newPassword;
      
      await user.save();
      console.log("Updated Password in DB:", user.password);
  
      res.json({ message: "Password updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

module.exports = { forgotPassword, verifyOTP, resetPassword };
