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

import { Logger } from './Logger';

const logger = Logger.get('Banners.ts', 'info');

export class Banners {
  public cli(): void {
    logger.info('🌍 Abc-CLI 🔨');
  }

  public done(): void {
    logger.info('Oh yeah 💪');
  }

  public big(): void {
    logger.info(`

  /$$$$$$  /$$                         /$$$$$$  /$$       /$$$$$$
 /$$__  $$| $$                        /$$__  $$| $$      |_  $$_/
| $$  \\ $$| $$$$$$$   /$$$$$$$       | $$  \\__/| $$        | $$
| $$$$$$$$| $$__  $$ /$$_____//$$$$$$| $$      | $$        | $$
| $$__  $$| $$  \\ $$| $$     |______/| $$      | $$        | $$
| $$  | $$| $$  | $$| $$             | $$    $$| $$        | $$
| $$  | $$| $$$$$$$/|  $$$$$$$       |  $$$$$$/| $$$$$$$$ /$$$$$$
|__/  |__/|_______/  \\_______/        \\______/ |________/|______/


    `);
  }
}
