export const verificationEmailTemplate = (link: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <h2 style="color: #4CAF50;">Welcome to Recipe Planner!</h2>
    <p>Hi there,</p>
    <p>Thank you for signing up. Please verify your email address to get started with planning your amazing meals.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${link}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
    </div>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all;"><a href="${link}">${link}</a></p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #888;">If you did not create an account, no further action is required.</p>
  </div>
`;
