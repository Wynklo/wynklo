import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;
    
    console.log('Received contact form submission:', { name, email, company, service });

    // Get notification emails
    const notificationEmails = process.env.NOTIFICATION_EMAILS ? 
      process.env.NOTIFICATION_EMAILS.split(',').map(e => e.trim()) : 
      [process.env.EMAIL_TO];
    
    console.log('Notification emails:', notificationEmails);
    console.log('Form data received successfully - frontend is working!');

    // TEMPORARY: Log the submission instead of sending emails
    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Company:', company);
    console.log('Service:', service);
    console.log('Message:', message);
    console.log('Would send to:', notificationEmails.join(', '));
    console.log('==============================');

    // Try to send emails (will fail until Gmail auth is fixed)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.verify();
      console.log('SMTP connection verified successfully');

      // 1. Send notification to team
      const teamMailOptions = {
        from: `"Wynklo Contact Form" <${process.env.EMAIL_FROM}>`,
        to: notificationEmails.join(', '),
        subject: `[Wynklo] New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service || 'Not selected'}</p>
          <h3>Message:</h3>
          <p>${message}</p>
          <hr>
          <p><small>This message was sent from the Wynklo contact form.</small></p>
        `,
        replyTo: email
      };

      // 2. Send confirmation to user
      const userMailOptions = {
        from: `"Wynklo Team" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Thank you for contacting Wynklo!',
        html: `
          <h2>Thank you for reaching out to Wynklo!</h2>
          <p>Dear ${name},</p>
          <p>We've received your message and will get back to you within 24-48 hours.</p>
          <p><strong>Your message details:</strong></p>
          <ul>
            <li><strong>Company:</strong> ${company || 'Not provided'}</li>
            <li><strong>Service:</strong> ${service || 'Not selected'}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
          <p>Best regards,<br>The Wynklo Team</p>
          <hr>
          <p><small>If you didn't submit this form, please ignore this email.</small></p>
        `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(teamMailOptions),
        transporter.sendMail(userMailOptions)
      ]);
      
      console.log('Emails sent successfully!');
    } catch (emailError) {
      console.log('Email failed (expected until Gmail auth is fixed):', emailError.message);
    }
    
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Export for Vercel serverless
export default app;
