import { ApiProperty } from '@nestjs/swagger';
import { Article } from '@prisma/client';

/**
 * Article 类由 Prisma Client生成
 * ArticleEntity 类由 用于swagger
 */
export class ArticleEntity implements Article {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  body: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
