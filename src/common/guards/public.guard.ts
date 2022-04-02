import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1 获取controller中对应的 路由处理函数
    const routeHandler = context.getHandler();
    // 2 通过反射获取 路由处理函数 的自定义装饰器
    const isPublic = this.reflector.get<string>('isPublic', routeHandler);
    console.log('isPublic', isPublic);
    return !!isPublic;
  }
}
