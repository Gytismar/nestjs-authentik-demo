import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateOAuthLogin(profile: any): any {
    const roles = profile.roles || [];
    return { userId: profile.id, roles };
  }
}
