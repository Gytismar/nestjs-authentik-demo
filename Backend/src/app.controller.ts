// src/app.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';

@Controller()
export class AppController {
  @Get('for-any-authenticated-user')
  @UseGuards(JwtAuthGuard)
  getForAnyAuthenticatedUser(@Request() req): string {
    return `Hello ${req.user.username}, you are authenticated!`;
  }

  @Get('only-for-viewer')
  @UseGuards(JwtAuthGuard)
  @Roles('viewer')
  getOnlyForViewer(@Request() req): string {
    return `Hello ${req.user.username}, you have access to viewer content!`;
  }

  @Get('only-for-manager')
  @UseGuards(JwtAuthGuard)
  @Roles('manager')
  getOnlyForManager(@Request() req): string {
    return `Hello ${req.user.username}, you have access to manager content!`;
  }
}
