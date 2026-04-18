import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Validation Schema
const newsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate input using Zod
        const result = newsletterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation Failed', details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // SMTP Configuration
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Professional Email Template for Newsletter Subscription
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Newsletter Subscription</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 30px 0;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">🎉 New Subscriber!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Someone joined your newsletter</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <p style="margin: 0; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Subscriber Email</p>
                    <p style="margin: 15px 0 0 0; font-size: 20px; color: #18181b; font-weight: 600;">
                      <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 13px; color: #71717a;">
                      Add this email to your newsletter mailing list.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #71717a;">
                This subscription was received via the <strong>Freedf Blog</strong>.
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
            from: `"Freedf Newsletter" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: `[Freedf Newsletter] New Subscriber: ${email}`,
            html: htmlContent,
        });

        return NextResponse.json(
            { success: true, message: 'Subscribed successfully!' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Newsletter SMTP Error:', error);
        return NextResponse.json(
            { error: 'Subscription failed. Please try again later.' },
            { status: 500 }
        );
    }
}
