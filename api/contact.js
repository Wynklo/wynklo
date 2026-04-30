import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, company, service, message } = req.body;
    
    console.log('Received contact form submission:', { name, email, company, service });

    // Get notification emails from environment variables
    const notificationEmails = process.env.NOTIFICATION_EMAILS ? 
      process.env.NOTIFICATION_EMAILS.split(',').map(e => e.trim()) : 
      [process.env.EMAIL_TO || 'contactuswynklo@gmail.com'];
    
    console.log('Notification emails:', notificationEmails);
    console.log('Email user:', process.env.EMAIL_USER);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter connection
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // 1. Send notification to team
    const teamMailOptions = {
      from: `"Wynklo Contact Form" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
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
      from: `"Wynklo Team" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
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
    
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
}
