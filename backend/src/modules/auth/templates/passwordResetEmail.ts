export const passwordResetEmailTemplate = (link: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #FF5722;">Password Reset Request</h2>
    <p>Hi there,</p>
    <p>You are receiving this email because we received a password reset request for your account.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="background-color: #FF5722; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p><strong>This reset link will expire in 1 hour.</strong></p>
    <p>If you did not request a password reset, no further action is required.</p>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all;"><a href="${link}">${link}</a></p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #888;">Recipe Planner Team</p>
  </div>
`;
