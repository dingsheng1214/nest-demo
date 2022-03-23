import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //排除dto字段之外的属性
      forbidNonWhitelisted: true, // 包含非dto内的属性则抛出异常
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
