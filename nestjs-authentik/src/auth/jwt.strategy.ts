import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksClient from 'jwks-rsa';

const authConfig = {
  issuerURL: 'http://localhost/application/o/netix/',
  jwksURL: 'http://localhost/application/o/netix/jwks/',
  clienID: 'add if needed',
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: jwksClient.passportJwtSecret({
        cache: true,
        rateLimit: false,
        jwksUri: authConfig.jwksURL,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // audience: authConfig.clienID, /* probably not needed */
      issuer: authConfig.issuerURL,
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    // console.log('jwt payload:', payload);
    return payload;
  }
}
