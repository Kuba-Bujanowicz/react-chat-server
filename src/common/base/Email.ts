import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

export class Email {
  static async send(to: string, subject: string, html: string) {
    return transporter.sendMail({
      from: process.env.EMAIL_AUTH_USER,
      to,
      subject,
      html,
    });
  }
}
