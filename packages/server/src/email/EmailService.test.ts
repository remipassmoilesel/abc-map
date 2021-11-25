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

import { EmailService } from './EmailService';
import { SmtpClient } from './SmtpClient';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { ConfigLoader } from '../config/ConfigLoader';
import { assert } from 'chai';
import { Language } from '@abc-map/shared';

describe('EmailService', () => {
  let client: SinonStubbedInstance<SmtpClient>;
  let service: EmailService;

  beforeEach(async () => {
    const config = await ConfigLoader.load();
    client = sinon.createStubInstance(SmtpClient);
    service = new EmailService(config, client as unknown as SmtpClient);
  });

  describe('confirmRegistration()', () => {
    it('FR', async () => {
      /* eslint-disable */
      const expectedMessage = "\n          <p>Bonjour !</p>\n          <p>Pour activer votre compte Abc-Map, veuillez <a href=\"http://localhost:10082/fr/confirm-account/confirm-registration-token\" data-cy=\"enable-account-link\">cliquer sur ce lien.</a></p>\n          <p>A bientôt !</p>\n          \n  <p>&nbsp;</p>\n  <small>Ceci est un message automatique, envoyé par la plateforme <a href=\"http://localhost:10082\">http://localhost:10082</a>.\n  Vous ne pouvez pas répondre à ce message.</small>\n\n        ";
      /* eslint-enable */

      await service.confirmRegistration(Language.French, 'to@domain', 'confirm-registration-token');

      assert.deepEqual(client.sendMail.args, [['to@domain', 'Activation de votre compte Abc-Map', expectedMessage]]);
    });

    it('EN', async () => {
      /* eslint-disable */
      const expectedMessage = "\n          <p>Hi !</p>\n          <p>To activate your Abc-Map account, please <a href=\"http://localhost:10082/en/confirm-account/confirm-registration-token\" data-cy=\"enable-account-link\">click on this link.</a></p>\n          <p>Goodbye !</p>\n          \n  <p>&nbsp;</p>\n  <small>This is an automatic message, sent by the platform <a href=\"http://localhost:10082\">http://localhost:10082</a>.\n  You cannot reply to this message.</small>\n\n        ";
      /* eslint-enable */

      await service.confirmRegistration(Language.English, 'to@domain', 'confirm-registration-token');

      assert.deepEqual(client.sendMail.args, [['to@domain', 'Activation of your Abc-Map account', expectedMessage]]);
    });
  });

  describe('resetPassword()', () => {
    it('FR', async () => {
      /* eslint-disable */
      const expectedMessage = "\n          <p>Bonjour !</p>\n          <p>Pour réinitialiser votre mot de passe Abc-Map, veuillez <a href=\"http://localhost:10082/fr/reset-password/reset-password-token\" data-cy=\"reset-password-link\">cliquer sur ce lien.</a></p>\n          <p>Si vous n'êtes pas à l'origine de cette demande, ne tenez pas compte de ce message.</p>\n          <p>A bientôt !</p>\n          \n  <p>&nbsp;</p>\n  <small>Ceci est un message automatique, envoyé par la plateforme <a href=\"http://localhost:10082\">http://localhost:10082</a>.\n  Vous ne pouvez pas répondre à ce message.</small>\n\n        ";
      /* eslint-enable */

      await service.resetPassword(Language.French, 'to@domain', 'reset-password-token');

      assert.deepEqual(client.sendMail.args, [['to@domain', 'Mot de passe perdu', expectedMessage]]);
    });

    it('EN', async () => {
      /* eslint-disable */
      const expectedMessage = "\n          <p>Hi !</p>\n          <p>To reset your Abc-Map password, please <a href=\"http://localhost:10082/en/reset-password/reset-password-token\" data-cy=\"reset-password-link\">click on this link.</a></p>\n          <p>If you are not the initiator of this request, ignore this message.</p>\n          <p>Goodbye !</p>\n          \n  <p>&nbsp;</p>\n  <small>This is an automatic message, sent by the platform <a href=\"http://localhost:10082\">http://localhost:10082</a>.\n  You cannot reply to this message.</small>\n\n        ";
      /* eslint-enable */

      await service.resetPassword(Language.English, 'to@domain', 'reset-password-token');

      assert.deepEqual(client.sendMail.args, [['to@domain', 'Reset your password', expectedMessage]]);
    });
  });
});
