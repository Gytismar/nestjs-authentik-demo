import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { OAuth2Strategy } from './oauth2.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'oauth2' })],
  providers: [
    AuthService,
    OAuth2Strategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Global role guard
    },
  ],
})
export class AuthModule {}
