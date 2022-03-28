import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  constructor(@Inject('Connection') private readonly type: string) {
    console.log('动态模块:', this.type);
  }
}
