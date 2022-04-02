import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('get all coffees', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .set('Authorization', 'aaa')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
