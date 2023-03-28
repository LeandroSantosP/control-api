import { CreateTokenRequest, IAuthProvider } from '../IAuthProvider';
import { compare } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

export class JwtAuthProvider implements IAuthProvider {
   CreateToken({
      payload,
      secretToken,
      complement,
   }: CreateTokenRequest): string {
      const token = sign(payload, secretToken, complement);
      return token;
   }

   async CompareBcrypt(
      currentPass: string,
      dbPassword: string
   ): Promise<boolean> {
      const result = compare(currentPass, dbPassword);
      return result;
   }

   VerifyToken(token: string, secretKey: string): string | JwtPayload {
      const params = verify(token, secretKey);
      return params;
   }
}
