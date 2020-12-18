import { Config } from '../config/Config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Logger } from './Logger';

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
    /* eslint-disable max-len */
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
          ${body}
      </div>
    `;
    /* eslint-enable max-len */

    const sending = await this.transporter.sendMail({
      to,
      subject,
      html,
    });

    if (this.config.development) {
      logger.info(`Mail preview available at: ${nodemailer.getTestMessageUrl(sending)}`);
    }
  }
}
