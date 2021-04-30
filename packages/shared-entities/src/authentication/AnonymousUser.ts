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

import { AbcUser } from './AbcUser';

/**
 * This a special user used for anonymous users.
 */
export const AnonymousUser: AbcUser = {
  id: 'anonymous-user',
  email: 'anonymous-user@abc-map.fr',
  // This password is useless, it is transmitted to all frontend clients, so we can commit it
  password: 'dd5005d5b739267a5bb39f0c602eb870cd21feb2707f0cda395794f81',
  enabled: true,
};

export function isUserAnonymous(user: AbcUser): boolean {
  return user.email === AnonymousUser.email;
}

export function isEmailAnonymous(email: string): boolean {
  return email === AnonymousUser.email;
}
