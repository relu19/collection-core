import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {OAuth2Client} from 'google-auth-library';
import {Users} from '../models';
import {UsersRepository} from '../repositories';
import {JWTService} from '../services';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

export class AuthController {
  constructor(
    @inject('services.JWTService')
    public jwtService: JWTService,
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) { }

  @post('/auth/google-login')
  async googleLogin(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['token'],
            properties: {
              token: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: {token: string},
  ): Promise<{token: string; user: Users}> {
    // If GOOGLE_CLIENT_ID is not set, skip Google verification (for development)
    let payload: any;

    if (GOOGLE_CLIENT_ID) {
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);
      try {
        const ticket = await client.verifyIdToken({
          idToken: credentials.token,
          audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (error) {
        throw new HttpErrors.Unauthorized('Invalid Google token');
      }
    } else {
      // Development mode - accept token as JSON containing user info
      try {
        payload = JSON.parse(credentials.token);
      } catch {
        throw new HttpErrors.BadRequest('Invalid token format for development mode');
      }
    }

    if (!payload || !payload.email) {
      throw new HttpErrors.Unauthorized('Invalid token payload');
    }

    // Find or create user
    let user = await this.usersRepository.findOne({
      where: {email: payload.email},
    });

    if (!user) {
      // Create new user
      user = await this.usersRepository.create({
        email: payload.email,
        name: payload.name || payload.email,
        logo: payload.picture || '',
        fbId: payload.sub || '',
        phone: '',
        type: 1, // Regular user type
        publicId: this.generatePublicId(),
      });
    } else {
      // Update user info if changed
      await this.usersRepository.updateById(user.id, {
        name: payload.name || user.name,
        logo: payload.picture || user.logo,
      });
      user = await this.usersRepository.findById(user.id!);
    }

    // Generate JWT token
    const userProfile: UserProfile = {
      [securityId]: user.id!.toString(),
      id: user.id!.toString(),
      email: user.email!,
      name: user.name,
    };

    const token = await this.jwtService.generateToken(userProfile);

    return {
      token,
      user,
    };
  }

  private generatePublicId(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
}

