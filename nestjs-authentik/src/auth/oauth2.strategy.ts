import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: '<AUTHENTIK_ISSUER_URL>/application/o/authorize/',
      tokenURL: '<AUTHENTIK_ISSUER_URL>/application/o/token/',
      clientID: '<CLIENT_ID>',
      clientSecret: '<CLIENT_SECRET>',
      callbackURL: 'http://localhost:3000/auth/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.authService.validateOAuthLogin(profile);
  }
}
