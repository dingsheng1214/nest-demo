import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

/**
 *
 * 拦截返回并封装响应结构
 *
 * {
 * 	"statusCode": 0,
 * 	"data": {
 * 		"id": 8,
 * 		"name": "美式2",
 * 		"brand": "Nest2",
 * 		"recommendations": 0,
 * 		"flavors": [
 * 			{
 * 				"id": 2,
 * 				"name": "热饮"
 * 			}
 * 		]
 * 	}
 * }
 */
@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // handle() 返回一个 Observable。此流包含从路由处理程序返回的值
    return next.handle().pipe(
      map((data) => ({
        statusCode: 0,
        data,
      })),
    );
  }
}
