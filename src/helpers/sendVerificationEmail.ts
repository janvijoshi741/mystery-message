import { Resend } from 'resend';
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
    from: 'noreplay@example.com',
    to: email,
    subject: 'Mystery Message | Verification Code',
    react: VerificationEmail({ username, otp: verifyCode }),
  });
return {success: true, message: "Verification email sent successfully"};
  }
 catch(error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}

// Code inside try for sending email using resend

// await resend.emails.send({
//     from: 'noreplay@example.com',
//     to: email,
//     subject: 'Mystery Message | Verification Code',
//     react: VerificationEmail({ username, otp: verifyCode }),
//   });
// return {success: true, message: "Verification email sent successfully"};

// import nodemailer from "nodemailer";
// import { ApiResponse } from "@/types/ApiResponse";

// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     const transporter = nodemailer.createTransport({
//       pool: true,
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       service: "gmail",
//       auth: {
//         user: "joshijanvi143@gmail.com",
//         pass: "myay rtdg juqq grrm",
//       },
//     });

//     const info = await transporter.sendMail({
//       from: 'joshijanvi143@gmail.com',
//       to: email,
//       subject: "Mystery Message | Verification Code",
//       text: `Hello ${username}, your verification code is: ${verifyCode}`,
//     //   html: `<p>Hello <strong>${username}</strong>,</p><p>Your verification code is: <strong>${verifyCode}</strong></p>`,
//     });

//     console.log("Verification email sent: %s", info.messageId);
//     console.log("Verify Code", verifyCode);

//     return {
//       success: true,
//       message: "Verification email sent successfully",
//     };
//   } catch (emailError) {
//     console.error("Error sending verification email:", emailError);
//     return {
//       success: false,
//       message: "Failed to send verification email",
//     };
//   }
// }


