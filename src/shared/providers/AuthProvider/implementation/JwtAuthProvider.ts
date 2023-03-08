import { CreateTokenRequest, IAuthProvider } from '../IAuthProvider';
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
}
