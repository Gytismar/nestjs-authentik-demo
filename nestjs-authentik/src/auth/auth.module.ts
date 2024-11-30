import { CanActivate, Module, Provider } from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AUTHN_GUARD_STRATEGY_TOKEN } from './auth.constants';
import { FakeAuthenticationGuard } from './guards/fake-authentication.guard';

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
    } satisfies Provider<JwtStrategy>,
    {
      provide: AUTHN_GUARD_STRATEGY_TOKEN,
      useFactory: () => {
        // return new (AuthGuard('jwt'))();
        return new FakeAuthenticationGuard({
          isAuthorized: true,
          authorizeIfNoToken: true,
        });
      },
    } satisfies Provider<CanActivate>,
  ],
  exports: [PassportModule, AUTHN_GUARD_STRATEGY_TOKEN],
})
export class AuthModule {}
