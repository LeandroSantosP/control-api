import { JwtPayload } from 'jsonwebtoken';

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

   abstract VerifyToken(token: string, secretKey: string): string | JwtPayload;
}

export { IAuthProvider };
