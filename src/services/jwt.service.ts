import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import * as jwt from 'jsonwebtoken';

export class JWTService {
  @inject('authentication.jwt.secret')
  public readonly jwtSecret: string;

  @inject('authentication.jwt.expiresIn')
  public readonly jwtExpiresIn: string;

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token: userProfile is null',
      );
    }
    let token = '';
    try {
      token = jwt.sign(
        {
          [securityId]: userProfile[securityId],
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
        },
        this.jwtSecret,
        {
          expiresIn: this.jwtExpiresIn,
        },
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error generating token: ${err}`);
    }
    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        'Error verifying token: token is null',
      );
    }

    let userProfile: UserProfile;
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      userProfile = Object.assign(
        {
          [securityId]: '',
          id: '',
          email: '',
          name: '',
        },
        {
          [securityId]: (decoded as any)[securityId],
          id: (decoded as any).id,
          email: (decoded as any).email,
          name: (decoded as any).name,
        },
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error verifying token: ${err}`);
    }
    return userProfile;
  }
}


