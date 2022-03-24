import { IsNumber, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { each: true }, // 检查阵列每一个元素是否都是数字
  )
  flavorIds: number[];
}
