import { CreateTokenRequest, IAuthProvider } from '../IAuthProvider';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

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
}
