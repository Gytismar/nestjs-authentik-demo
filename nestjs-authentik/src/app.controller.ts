import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { HasPermission, Roles } from './auth/auth.decorators';
import { AuthorizationGuard } from './auth/guards/authorization.guard';
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
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles('viewer')
  viewerOnly() {
    return 'This is only for viewers';
  }

  @Get('/api/only-for-manager')
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Roles('manager')
  managerOnly() {
    return 'This is only for managers';
  }

  @UseGuards(AuthorizationGuard)
  @Get('/api/for-any-authenticated-user')
  anyAuthenticated() {
    return 'This is for any authenticated user';
  }

  @UseGuards(AuthorizationGuard, PermissionGuard)
  @HasPermission(Permission.ReadTitleDetails)
  @Get('/api/can-read-title-details')
  getTitleDetails() {
    return 'This is for those that can read title details';
  }

  @UseGuards(AuthorizationGuard, PermissionGuard)
  @HasPermission(Permission.ReadTitles)
  @Get('/api/can-read-titles')
  getTitles() {
    return 'This is for those that can read titles';
  }
}
