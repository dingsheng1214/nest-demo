import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyGuard } from '../../src/common/guards/api-key.guard';
import { TimeoutInterceptor } from '../../src/common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { HttpExceptionFilter } from '../../src/common/filter/http-exception.filter';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

const coffee = {
  name: '咖啡1',
  brand: 'Buddy Brew',
  flavorIds: [1, 2],
};
describe('[Feature] coffees - /coffees', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'postgres',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true, // 生产环境禁用，自动根据entity实体类生成对应的SQL 表
        }),
        CoffeesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    // 全局异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());
    console.log('1111111111');
    await app.init();
  });

  it('get all coffees', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .set('Authorization', 'aaa')
      .expect(200);
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .set('Authorization', 'aaa')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });

  afterAll(async () => {
    await app?.close();
  });
});
