// /netlify/functions/sendEmail.js
const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields." }),
      };
    }

    // Create transporter with Gmail service
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to you (the site owner)
    const ownerMailOptions = {
      from: `"LaunchLayer Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `You have a new contact request:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      replyTo: email,
    };

    // Confirmation email to the user who sent the form
    const userMailOptions = {
      from: `"LaunchLayer Website" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting LaunchLayer, ${name}!`,
      text: `Hi ${name},\n\nThank you for reaching out! We received your message:\n\n"${message}"\n\nWe will get back to you shortly.\n\nBest,\nThe LaunchLayer Team`,
    };

    // Send both emails (in parallel)
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent successfully" }),
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send emails" }),
    };
  }
};
