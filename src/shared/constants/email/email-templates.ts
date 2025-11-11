export const generateOtpHtml = (otp: string): string => {
  return `
    <div style="font-family:Arial,sans-serif;">
      <h3>Email Verification</h3>
      <p>Your one-time password (OTP) is:</p>
      <div style="
        background:#f4f4f4;
        display:inline-block;
        padding:10px 20px;
        border-radius:6px;
        font-size:18px;
      ">
        <b>${otp}</b>
      </div>
      <p>This OTP will expire in 120 seconds.</p>
    </div>
  `;
};

export const generateResetPasswordHtml = (resetLink: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h3 style="color: #2c3e50;">Reset Your Password</h3>
      <p>Hello,</p>
      <p>We received a request to reset your password. You can set a new one by clicking the button below:</p>
      
      <div style="margin: 20px 0;">
        <a href="${resetLink}" 
           style="
             background-color: #007bff;
             color: #fff;
             text-decoration: none;
             padding: 10px 20px;
             border-radius: 6px;
             display: inline-block;
             font-weight: bold;
           ">
          Reset Password
        </a>
      </div>

      <p>This link will expire in <b>30 minutes</b>. If you didn’t request a password reset, you can safely ignore this email.</p>

      <p>Thanks,<br>The Support Team</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
      <p style="font-size: 12px; color: #777;">If the button doesn’t work, copy and paste the following link into your browser:</p>
      <p style="font-size: 12px; color: #007bff; word-break: break-all;">${resetLink}</p>
    </div>
  `;
};
