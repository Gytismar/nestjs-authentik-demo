import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    {
      provide: JwtStrategy,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new JwtStrategy({
          issuerURL: config.getOrThrow('OAUTH2_ISSUER_URL'),
          jwksURL: config.getOrThrow('OAUTH2_JWKS_URL'),
          clientID: config.getOrThrow('OAUTH2_CLIEND_ID'),
        });
      },
    },
  ],
  exports: [PassportModule],
})
export class AuthModule {}
