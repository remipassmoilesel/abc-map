
export interface IDbUser {
    id: string;
    username: string;
    email: string;
    passwordSalt: string;
    encryptedPassword: string;
}
