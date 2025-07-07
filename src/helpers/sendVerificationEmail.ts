import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Debug: Check if environment variables are loaded
    console.log("GMAIL_USER:", process.env.GMAIL_USER ? "Set" : "Not set");
    console.log(
      "GMAIL_APP_PASSWORD:",
      process.env.GMAIL_APP_PASSWORD ? "Set" : "Not set"
    );

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error(
        "Gmail credentials not properly configured in environment variables"
      );
    }
    // Create transporter with proper Gmail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Send email
    const info = await transporter.sendMail({
      from: {
        name: "Mystery Message",
        address:
          (process.env.GMAIL_USER as string) || "joshijanvi143@gmail.com",
      },
      to: email,
      subject: "Mystery Message | Verification Code",
      text: `Hello ${username},\n\nYour verification code is: ${verifyCode}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nMystery Message Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Mystery Message</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hello <strong>${username}</strong>,</p>
            <p>Your verification code is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px; padding: 10px 20px; border: 2px solid #007bff; border-radius: 5px; display: inline-block;">
                ${verifyCode}
              </span>
            </div>
            <p>If you didn't request this verification code, please ignore this email.</p>
          </div>
          <p style="color: #666; font-size: 12px; text-align: center;">
            Best regards,<br>
            Mystery Message Team
          </p>
        </div>
      `,
    });

    console.log("Verification email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Verification Code:", verifyCode);

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);

    // More detailed error logging
    if (emailError instanceof Error) {
      console.error("Error message:", emailError.message);
      console.error("Error stack:", emailError.stack);
    }

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
