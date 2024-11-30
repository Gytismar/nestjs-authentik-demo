import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { HasPermission, Roles } from './auth/auth.decorators';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { PermissionGuard } from './auth/guards/permission.guard';
import { Permission } from './auth/user.entity';
import { RolesGuard } from './auth/guards/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/api/only-for-viewer')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles('viewer')
  viewerOnly() {
    return 'This is only for viewers';
  }

  @Get('/api/only-for-manager')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles('manager')
  managerOnly() {
    return 'This is only for managers';
  }

  @UseGuards(AuthenticationGuard)
  @Get('/api/for-any-authenticated-user')
  anyAuthenticated() {
    return 'This is for any authenticated user';
  }

  @UseGuards(AuthenticationGuard, PermissionGuard)
  @HasPermission(Permission.ReadTitleDetails)
  @Get('/api/can-read-title-details')
  getTitleDetails() {
    return 'This is for those that can read title details';
  }

  @UseGuards(AuthenticationGuard, PermissionGuard)
  @HasPermission(Permission.ReadTitles)
  @Get('/api/can-read-titles')
  getTitles() {
    return 'This is for those that can read titles';
  }
}
