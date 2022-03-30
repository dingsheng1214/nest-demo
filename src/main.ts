import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log('当前环境:', process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(new ApiKeyGuard());
  app.useGlobalInterceptors(new TimeoutInterceptor());

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

  const config = new DocumentBuilder()
    .setTitle('nest-demo')
    .setDescription('The nest-demo description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
