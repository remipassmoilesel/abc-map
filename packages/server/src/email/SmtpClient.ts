/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { Config } from '../config/Config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Logger } from '@abc-map/shared';
import * as fs from 'fs';
import * as path from 'path';

const logger = Logger.get('SmtpClient.ts', 'info');

export function disableSmtpClientLogging() {
  logger.disable();
}

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

    if (!this.config.development?.persistEmails) {
      await this.transporter.sendMail({
        from: this.config.smtp.from,
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

  // TODO: promisify
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
