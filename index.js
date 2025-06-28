const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Email Regex Validator
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Nodemailer Transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

console.log("datagot",transporter);


// Fixed Subject and Body
const fixedSubject = "Interested in Mern developer position";
const fixedBody = `
Dear Team,

I am writing to express my interest in the MERN Stack Developer position. With over 3+ years of experience in the MERN stack, I have developed 20+ projects, which you can view on my GitHub and portfolio.

Currently, I am working as a Tech Lead, where I manage a team of 7+ developers. My experience spans across front-end and back-end technologies, including HTML, CSS, JavaScript, React, Node.js, and MongoDB. I also have experience with deployment platforms like AWS, DigitalOcean, and Vercel. My dedication and enthusiasm for coding make me a valuable addition to your team.

My resume is attached for more details. I am available for an interview at your convenience and can be reached at 9562857669 or clintogeorge007@gmail.com.

Thank you for considering my application.

Sincerely,
Clinto George
9562857669
`;

// API to Send Mails
app.post('/send-mails', async (req, res) => {
  const { emails } = req.body;

  console.log("body", emails);

  if (!Array.isArray(emails)) {
    return res.status(400).json({ message: "Emails should be an array." });
  }

  const invalidEmails = emails.filter(email => !isValidEmail(email));
  if (invalidEmails.length > 0) {
    return res.status(400).json({ message: "Invalid email(s) detected.", invalidEmails });
  }

  const results = [];

  for (const email of emails) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email, // Send to one recipient at a time
      subject: fixedSubject,
      text: fixedBody,
      attachments: [
        {
          filename: 'clintogeorgemernstack.pdf',
          path: './resume/clintogeorgemernstack.pdf',
          contentType: 'application/pdf'
        }
      ]
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to: ${email}`);
      results.push({ email, status: 'success' });
    } catch (error) {
      console.error(`Failed to send email to: ${email}`, error);
      results.push({ email, status: 'failed', error: error.message });
    }
  }

  res.json({ message: "Email process completed.", results });
});


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Job Mailer running on port ${PORT}`);
});
