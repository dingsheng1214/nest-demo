import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 守卫处理逻辑
    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.header('Authorization');
    console.log('ApiKeyGuard auth:', auth);
    return !!auth;
  }
}
