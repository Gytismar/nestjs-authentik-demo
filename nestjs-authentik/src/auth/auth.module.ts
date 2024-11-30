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
        const env = config.getOrThrow<string>('NODE_ENV');
        const useFakeAuth = config.get<string>('USE_FAKE_AUTH', 'false');
        if (env !== 'production' && useFakeAuth === 'true') {
          return new JwtStrategy({
            issuerURL: 'x',
            jwksURL: 'x',
            clientID: 'x',
          });
        }

        return new JwtStrategy({
          issuerURL: config.getOrThrow('OAUTH2_ISSUER_URL'),
          jwksURL: config.getOrThrow('OAUTH2_JWKS_URL'),
          clientID: config.getOrThrow('OAUTH2_CLIEND_ID'),
        });
      },
    } satisfies Provider<JwtStrategy>,
    {
      provide: AUTHN_GUARD_STRATEGY_TOKEN,
      useFactory: (config: ConfigService) => {
        const env = config.getOrThrow<string>('NODE_ENV');
        const useFakeAuth = config.get<string>('USE_FAKE_AUTH', 'false');
        if (env !== 'production' && useFakeAuth === 'true') {
          return new FakeAuthenticationGuard({
            isAuthorized: true,
            authorizeIfNoToken: true,
          });
        }

        return new (AuthGuard('jwt'))();
      },
      inject: [ConfigService],
    } satisfies Provider<CanActivate>,
  ],
  exports: [PassportModule, AUTHN_GUARD_STRATEGY_TOKEN],
})
export class AuthModule {}
