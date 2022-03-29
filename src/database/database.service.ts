import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('Connection') private readonly type: string,
    private readonly configService: ConfigService,
  ) {
    console.log('动态模块:', this.type);
    console.log(
      'ConfigService:',
      this.configService.get<string>('DATABASE_HOST'),
    );
  }
}
