import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendContactFormEmail = async ({ name, email, message }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'projectmaukajpis@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            This message was sent from the Mauka contact form on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to Mauka - Your Volunteer Journey Starts Here!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #10b981); padding: 40px 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Welcome to Mauka!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your volunteer journey starts here</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #1f2937;">Hello ${userName}! 👋</h2>
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              We're thrilled to have you join the Mauka community! You've just taken the first step 
              towards making a meaningful impact in communities across India.
            </p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>Complete your profile to get better volunteer matches</li>
                <li>Browse available programs and NGO opportunities</li>
                <li>Use our AI matching to find your perfect volunteer fit</li>
                <li>Start making impact and climb the leaderboard!</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/ai-match" 
                 style="background: linear-gradient(135deg, #2563eb, #10b981); color: white; text-decoration: none; 
                        padding: 15px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">
                Find My Perfect Match
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              If you have any questions, feel free to reach out to us at 
              <a href="mailto:projectmaukajpis@gmail.com" style="color: #2563eb;">
                projectmaukajpis@gmail.com
              </a>
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email failures
    return null;
  }
};