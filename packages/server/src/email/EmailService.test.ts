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
import { assert, expect } from 'chai';
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
      await service.confirmRegistration(Language.French, 'to@domain', 'confirm-registration-token');

      assert.deepEqual(client.sendMail.callCount, 1);
      assert.deepEqual(client.sendMail.args[0][0], 'to@domain');
      assert.deepEqual(client.sendMail.args[0][1], 'Activation de votre compte Abc-Map');
      expect(client.sendMail.args[0][2]).toMatchSnapshot();
    });

    it('EN', async () => {
      await service.confirmRegistration(Language.English, 'to@domain', 'confirm-registration-token');

      assert.deepEqual(client.sendMail.callCount, 1);
      assert.deepEqual(client.sendMail.args[0][0], 'to@domain');
      assert.deepEqual(client.sendMail.args[0][1], 'Activation of your Abc-Map account');
      expect(client.sendMail.args[0][2]).toMatchSnapshot();
    });
  });

  describe('resetPassword()', () => {
    it('FR', async () => {
      await service.resetPassword(Language.French, 'to@domain', 'reset-password-token');

      assert.deepEqual(client.sendMail.callCount, 1);
      assert.deepEqual(client.sendMail.args[0][0], 'to@domain');
      assert.deepEqual(client.sendMail.args[0][1], 'Mot de passe perdu');
      expect(client.sendMail.args[0][2]).toMatchSnapshot();
    });

    it('EN', async () => {
      await service.resetPassword(Language.English, 'to@domain', 'reset-password-token');

      assert.deepEqual(client.sendMail.callCount, 1);
      assert.deepEqual(client.sendMail.args[0][0], 'to@domain');
      assert.deepEqual(client.sendMail.args[0][1], 'Reset your password');
      expect(client.sendMail.args[0][2]).toMatchSnapshot();
    });
  });
});
