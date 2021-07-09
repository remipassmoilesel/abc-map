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
