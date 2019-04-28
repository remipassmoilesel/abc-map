
export interface IDbUser {
    username: string;
    email: string;
    passwordSalt: string;
    encryptedPassword: string;
}
