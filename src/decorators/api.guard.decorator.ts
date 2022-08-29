import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const ApiGuard = () =>
  applyDecorators(UseGuards(AuthGuard(['basic', 'jwt'])));
