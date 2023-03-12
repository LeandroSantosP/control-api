export interface Payload {
  [key: string]: string;
}

interface Complement {
  expiresIn: string;
  subject: string;
}

export interface CreateTokenRequest {
  payload: Payload;
  secretToken: string;
  complement: Complement;
}

abstract class IAuthProvider {
  abstract CreateToken({
    payload,
    secretToken,
    complement,
  }: CreateTokenRequest): string;

  abstract CompareBcrypt(
    currentPass: string,
    dbPassword: string
  ): Promise<boolean>;
}

export { IAuthProvider };
