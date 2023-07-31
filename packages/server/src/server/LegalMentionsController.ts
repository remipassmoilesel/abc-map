/**
 * Copyright © 2022 Rémi Pace.
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
import { FastifyInstance } from 'fastify';
import { Logger } from '@abc-map/shared';
import { Controller } from './Controller';

export const logger = Logger.get('LegalMentionsController.ts');

export class LegalMentionsController implements Controller {
  constructor(private config: Config) {}

  public getRoot(): string {
    return '/';
  }

  public setup = async (app: FastifyInstance): Promise<void> => {
    const { legalMentions } = this.config;

    const document = asDocument(legalMentions);
    app.get('/legal-mentions.html', (req, reply) => void reply.header('Content-Type', 'text/html; charset=utf-8').send(document));
  };
}

function asDocument(content: string): string {
  return `\n
<html>
<head>
<meta charset="utf-8" />
<title>Legal mentions</title>
</head>
<body>
${content}
</body>
</html>`;
}
