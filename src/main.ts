import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ApiKeyGuard } from './common/guards/api-key.guard';

async function bootstrap() {
  console.log('当前环境:', process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new ApiKeyGuard());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //排除dto字段之外的属性
      forbidNonWhitelisted: true, // 包含非dto内的属性则抛出异常
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // class-transformer 将会根据TS反射类型进行转换
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
