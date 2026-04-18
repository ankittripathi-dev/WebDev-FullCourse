import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // SMTP Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465, // Default to SSL/465
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verification (Optional but good for debugging)
    // await transporter.verify();

    // Professional Email Template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #0F172A; padding: 30px 0;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">Freedf</h1>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">New Contact Inquiry</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px; border-bottom: 1px solid #e4e4e7;">
                    <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Sender Details</p>
                    <p style="margin: 10px 0 0 0; font-size: 16px; color: #18181b;">
                      <strong>${name}</strong>
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #2563eb;">
                      <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Message</p>
                    <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin-top: 15px; border-radius: 0 4px 4px 0;">
                      <p style="margin: 0 0 10px 0; font-weight: 600; color: #18181b; font-size: 16px;">${subject}</p>
                      <p style="margin: 0; line-height: 1.6; color: #3f3f46; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                This message was sent securely via the <strong>Freedf</strong> contact form.
              </p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #a1a1aa;">
                &copy; ${new Date().getFullYear()} Freedf. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send Mail
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // Sender address (must be authenticated user for Gmail)
      replyTo: email, // Valid reply-to address
      to: process.env.SMTP_USER, // Receiver
      subject: `[Freedf Contact] ${subject}`,
      html: htmlContent,
    });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('SMTP Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
