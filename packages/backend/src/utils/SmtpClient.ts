import { Config } from '../config/Config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Logger } from './Logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = Logger.get('SmtpClient.ts', 'info');

export class SmtpClient {
  private transporter: Transporter;

  constructor(private config: Config) {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
    });
  }

  public async sendMail(to: string, subject: string, body: string): Promise<void> {
    logger.info(`Sending mail to ${to}`);
    const html = this.htmlTemplate(subject, body);

    if (!this.config.development) {
      await this.transporter.sendMail({
        to,
        subject,
        html,
      });
    } else {
      this.fakeSending(to, html);
    }
  }

  private htmlTemplate(subject: string, body: string): string {
    /* eslint-disable max-len */
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${subject}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;";
            }
        </style>
      </head>
      <body>
          ${body}
      </body>
      </html>
    `;
    /* eslint-enable max-len */
  }

  private fakeSending(email: string, body: string): void {
    const mailDir = path.resolve(__dirname, '..', '..', '..', 'e2e-tests', 'emails');
    const mailPath = path.resolve(mailDir, `${email}.html`);

    logger.warn(`Mail will not be sent, you can see it at: ${mailPath}`);
    if (!fs.existsSync(mailDir)) {
      fs.mkdirSync(mailDir);
    }
    fs.writeFileSync(mailPath, body);
  }
}
