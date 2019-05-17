import crypto from 'crypto';

export class PasswordHelper {

    public static encryptPassword(password: string, salt: string) {
        return crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    }

}
