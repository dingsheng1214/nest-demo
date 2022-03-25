import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // 是否是可选的, 如果是，则忽略一切校验
  @IsPositive() // 是否为正整数
  // @Type(() => Number) // 确保传入的值被解析为number
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number)
  offset: number;
}
