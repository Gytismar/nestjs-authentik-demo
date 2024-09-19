import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('api')
export class AppController {
  @Get('only-for-viewer')
  @UseGuards(RolesGuard)
  @Roles('viewer')
  viewerOnly() {
    return 'This is only for viewers';
  }

  @Get('only-for-manager')
  @UseGuards(RolesGuard)
  @Roles('manager')
  managerOnly() {
    return 'This is only for managers';
  }

  @Get('for-any-authenticated-user')
  anyAuthenticated() {
    return 'This is for any authenticated user';
  }
}
