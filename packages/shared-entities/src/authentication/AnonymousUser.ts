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
