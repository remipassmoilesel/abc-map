import * as crypto from 'crypto';
import { Config } from '../config/Config';

const hashAlgorithm = 'sha512';

export class PasswordHasher {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async hashPassword(password: string, userId: string): Promise<string> {
    const hmac = crypto.createHmac(hashAlgorithm, this.config.authentication.passwordSalt);
    return hmac.update(password + userId).digest('hex');
  }

  public async verifyPassword(password: string, userId: string, hash: string): Promise<boolean> {
    const hmac = crypto.createHmac(hashAlgorithm, this.config.authentication.passwordSalt);
    const digest = hmac.update(password + userId).digest('hex');
    return digest === hash;
  }
}
