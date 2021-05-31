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

import { AbstractService } from '../services/AbstractService';
import { SmtpClient } from './SmtpClient';
import { Config } from '../config/Config';

export class EmailService extends AbstractService {
  public static create(config: Config): EmailService {
    const smtp = new SmtpClient(config);
    return new EmailService(config, smtp);
  }

  constructor(private config: Config, private smtp: SmtpClient) {
    super();
  }

  public confirmRegistration(to: string, token: string): Promise<void> {
    const subject = 'Activation de votre compte Abc-Map';
    const href = `${this.config.externalUrl}/confirm-account/${token}`;
    const content = `
        <p>Bonjour !</p>
        <p>Pour activer votre compte Abc-Map, veuillez <a href="${href}" data-cy="enable-account-link">cliquer sur ce lien.</a></p>
        <p>A bientôt !</p>
        <p>&nbsp;</p>
        <small>Ceci est un message automatique, envoyé par la plateforme <a href="${this.config.externalUrl}">${this.config.externalUrl}</a>.
        Vous ne pouvez pas répondre à ce message.</small>
      `;
    return this.smtp.sendMail(to, subject, content);
  }

  public passwordLost(to: string, token: string): Promise<void> {
    const subject = 'Mot de passe perdu';
    const href = `${this.config.externalUrl}/reset-password/${token}`;
    const content = `
        <p>Bonjour !</p>
        <p>Pour réinitialiser votre mot de passe Abc-Map, veuillez <a href="${href}" data-cy="reset-password-link">cliquer sur ce lien.</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ne tenez pas compte de ce message.</p>
        <p>A bientôt !</p>
        <p>&nbsp;</p>
        <small>Ceci est un message automatique, envoyé par la plateforme <a href="${this.config.externalUrl}">${this.config.externalUrl}</a>.
        Vous ne pouvez pas répondre à ce message.</small>
      `;
    return this.smtp.sendMail(to, subject, content);
  }
}
