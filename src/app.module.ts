import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@119.3.214.158:27017/ds-cli'),
    CatsModule,
  ],
})
export class AppModule {}
