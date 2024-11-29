import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user.entity';

@Injectable()
export class AuthorizationGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AuthorizationGuard.name);

  async canActivate(context: ExecutionContext) {
    try {
      const canActivate = await super.canActivate(context);
      if (!canActivate) {
        this.logger.warn(`Unauthorized access request`);
        return false;
      }

      const user = context.switchToHttp().getRequest().user as User;
      this.logger.verbose(`Authenticated user '${user.id}'`);

      return true;
    } catch (error) {
      this.logger.error(`Error during authentication: ${error.message}`);
    }

    return false;
  }
}
