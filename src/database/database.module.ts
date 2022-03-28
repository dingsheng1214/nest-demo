import { DynamicModule, Module } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
})
export class DatabaseModule {
  static register(type): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'Connection',
          useValue: type,
        },
      ],
    };
  }
}
