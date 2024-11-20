import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/only-for-viewer')
  @UseGuards(RolesGuard)
  @Roles('viewer')
  viewerOnly() {
    return 'This is only for viewers';
  }

  @Get('/api/only-for-manager')
  @UseGuards(RolesGuard)
  @Roles('manager')
  managerOnly() {
    return 'This is only for managers';
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/api/for-any-authenticated-user')
  anyAuthenticated() {
    return 'This is for any authenticated user';
  }
}
