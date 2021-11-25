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
import { FrontendRoutes, Language } from '@abc-map/shared';

const Routes = {
  [Language.French]: new FrontendRoutes(Language.French),
  [Language.English]: new FrontendRoutes(Language.English),
};

const footerFr = (config: Config) => `
  <p>&nbsp;</p>
  <small>Ceci est un message automatique, envoyé par la plateforme <a href="${config.externalUrl}">${config.externalUrl}</a>.
  Vous ne pouvez pas répondre à ce message.</small>
`;

const footerEn = (config: Config) => `
  <p>&nbsp;</p>
  <small>This is an automatic message, sent by the platform <a href="${config.externalUrl}">${config.externalUrl}</a>.
  You cannot reply to this message.</small>
`;

export class EmailService extends AbstractService {
  public static create(config: Config): EmailService {
    const smtp = new SmtpClient(config);
    return new EmailService(config, smtp);
  }

  constructor(private config: Config, private smtp: SmtpClient) {
    super();
  }

  public confirmRegistration(lang: Language, to: string, token: string): Promise<void> {
    let subject: string;
    let content: string;
    const href = `${this.config.externalUrl}${Routes[lang].confirmAccount().withParams({ token })}`;

    switch (lang) {
      case Language.French:
        subject = 'Activation de votre compte Abc-Map';
        content = `
          <p>Bonjour !</p>
          <p>Pour activer votre compte Abc-Map, veuillez <a href="${href}" data-cy="enable-account-link">cliquer sur ce lien.</a></p>
          <p>A bientôt !</p>
          ${footerFr(this.config)}
        `;
        break;
      case Language.English:
        subject = 'Activation of your Abc-Map account';
        content = `
          <p>Hi !</p>
          <p>To activate your Abc-Map account, please <a href="${href}" data-cy="enable-account-link">click on this link.</a></p>
          <p>Goodbye !</p>
          ${footerEn(this.config)}
        `;
        break;
    }

    return this.smtp.sendMail(to, subject, content);
  }

  public resetPassword(lang: Language, to: string, token: string): Promise<void> {
    let subject: string;
    let content: string;

    const href = `${this.config.externalUrl}${Routes[lang].resetPassword().withParams({ token })}`;

    switch (lang) {
      case Language.French:
        subject = 'Mot de passe perdu';
        content = `
          <p>Bonjour !</p>
          <p>Pour réinitialiser votre mot de passe Abc-Map, veuillez <a href="${href}" data-cy="reset-password-link">cliquer sur ce lien.</a></p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ne tenez pas compte de ce message.</p>
          <p>A bientôt !</p>
          ${footerFr(this.config)}
        `;
        break;
      case Language.English:
        subject = 'Reset your password';
        content = `
          <p>Hi !</p>
          <p>To reset your Abc-Map password, please <a href="${href}" data-cy="reset-password-link">click on this link.</a></p>
          <p>If you are not the initiator of this request, ignore this message.</p>
          <p>Goodbye !</p>
          ${footerEn(this.config)}
        `;
        break;
    }
    return this.smtp.sendMail(to, subject, content);
  }
}
