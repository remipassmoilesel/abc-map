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

export enum ErrorCodes {
  WrongPassword = 'ABC_WrongPassword',
  MissingPassword = 'ABC_MissingPassword',
}

export class Errors {
  public static isWrongPassword(e: Error | undefined): boolean {
    return !!e?.message.match(ErrorCodes.WrongPassword);
  }

  public static wrongPassword(source?: Error): never {
    throw new Error(`${ErrorCodes.WrongPassword} Wrong password: ${source?.message || 'No source message'}`);
  }

  public static isMissingPassword(e: Error | undefined): boolean {
    return !!e?.message.match(ErrorCodes.MissingPassword);
  }

  public static missingPassword(): never {
    throw new Error(`${ErrorCodes.MissingPassword} Missing password`);
  }
}
