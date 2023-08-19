/**
 * Copyright © 2023 Rémi Pace.
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
    logger.info('🌍 abc-cli 🔨');
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

  public done(): void {
    logger.info('Oh yeah 💪');
  }

  public bigDone() {
    logger.info(`

888       888     .d88888b.     888       888
888   o   888    d88P" "Y88b    888   o   888
888  d8b  888    888     888    888  d8b  888
888 d888b 888    888     888    888 d888b 888
888d88888b888    888     888    888d88888b888
88888P Y88888    888     888    88888P Y88888
8888P   Y8888    Y88b. .d88P    8888P   Y8888
888P     Y888     "Y88888P"     888P     Y888

888       888     .d88888b.     888       888          888
888   o   888    d88P" "Y88b    888   o   888          888
888  d8b  888    888     888    888  d8b  888          888
888 d888b 888    888     888    888 d888b 888          888
888d88888b888    888     888    888d88888b888          888
88888P Y88888    888     888    88888P Y88888          Y8P
8888P   Y8888    Y88b. .d88P    8888P   Y8888           "
888P     Y888     "Y88888P"     888P     Y888          888


    That was long

    `);
  }
}
