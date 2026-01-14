const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Shri Balaji Guest House - Your Home Away From Home!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        </style>
      </head>
      <body style="font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <div style="background: linear-gradient(135deg, #1a237e 0%, #283593 100%); padding: 30px 20px; text-align: center;">
            <!-- Logo Placeholder - Replace with actual logo URL -->
            <div style="margin-bottom: 20px;">
              <img src="https://s3.us-east-1.amazonaws.com/cdn.designcrowd.com/blog/120-cool-logos-for-a-fresh-new-look/gaming-battle-soldier-sword-by-amcstudio-brandcrowd.png" alt="Shri Balaji Guest House" style="max-width: 180px; height: auto; background-color: white; padding: 15px; border-radius: 10px; display: inline-block;">
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Shri Balaji Guest House</h1>
            <p style="color: #e0e0ff; margin: 10px 0 0; font-size: 16px;">Experience Divine Comfort & Hospitality</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a237e; margin-top: 0; font-size: 24px;">Namaste, ${name}!</h2>
            
            <p style="color: #555; line-height: 1.7; font-size: 16px; margin-bottom: 25px;">
              Welcome to the Shri Balaji Guest House family! We're absolutely delighted to have you with us. 
              Your account has been successfully created, unlocking a world of comfortable stays and seamless booking experiences.
            </p>
            
            <div style="background-color: #f3f4ff; padding: 25px; border-radius: 8px; border-left: 4px solid #1a237e; margin: 25px 0;">
              <h3 style="color: #1a237e; margin-top: 0; font-size: 18px;">✨ What You Can Do Now:</h3>
              <ul style="color: #444; line-height: 1.8; padding-left: 20px;">
                <li>Book rooms instantly with our best rates guaranteed</li>
                <li>Manage existing reservations online</li>
                <li>Access exclusive member-only offers</li>
                <li>Save your preferences for faster bookings</li>
                <li>Receive special discounts and promotions</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="YOUR_BOOKING_PORTAL_URL" style="background: linear-gradient(135deg, #1a237e 0%, #283593 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);">
                Explore Rooms & Book Now
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.7; font-size: 16px;">
              At Shri Balaji Guest House, we blend traditional Indian hospitality with modern comforts to ensure your stay is memorable. 
              Whether you're traveling for business, pilgrimage, or leisure, we're committed to making you feel at home.
            </p>
            
            <!-- Contact Info -->
            <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #eee;">
              <h3 style="color: #1a237e; font-size: 18px; margin-bottom: 15px;">📞 Need Assistance?</h3>
              <p style="color: #555; line-height: 1.6; margin: 8px 0;">
                <strong>Reception:</strong> +91-XXXXXXXXXX<br>
                <strong>Email:</strong> info@shribalajiguesthouse.com<br>
                <strong>Address:</strong> [Your Hotel Address Here]
              </p>
            </div>
          </div>
          
          <!-- Social Media & Footer -->
          <div style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eee;">
            <h3 style="color: #1a237e; font-size: 18px; margin-bottom: 20px;">Stay Connected With Us</h3>
            
            <div style="margin-bottom: 25px;">
              <a href="YOUR_FACEBOOK_URL" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                <div style="width: 40px; height: 40px; background-color: #4267B2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">f</span>
                </div>
              </a>
              <a href="YOUR_INSTAGRAM_URL" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                <div style="width: 40px; height: 40px; background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">ig</span>
                </div>
              </a>
              <a href="YOUR_TWITTER_URL" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                <div style="width: 40px; height: 40px; background-color: #1DA1F2; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">𝕏</span>
                </div>
              </a>
              <a href="YOUR_TRIPADVISOR_URL" style="display: inline-block; margin: 0 12px; text-decoration: none;">
                <div style="width: 40px; height: 40px; background-color: #00af87; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-weight: bold;">TA</span>
                </div>
              </a>
            </div>
            
            <p style="color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
              <strong>Shri Balaji Guest House</strong><br>
              Where Tradition Meets Comfort
            </p>
            
            <p style="color: #aaa; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              © ${new Date().getFullYear()} Shri Balaji Guest House. All rights reserved.<br>
              <a href="YOUR_PRIVACY_POLICY_URL" style="color: #888; text-decoration: none;">Privacy Policy</a> | 
              <a href="YOUR_TERMS_URL" style="color: #888; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error to avoid breaking signup if email fails
  }
};

module.exports = { sendWelcomeEmail };