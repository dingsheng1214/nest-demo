import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { WrapResponseInterceptor } from '../common/interceptors/wrap-response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees')
// @UseInterceptors(WrapResponseInterceptor) // 控制器范围的拦截器
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {
    /**
     * scope 实际上是在注入链中冒泡的
     * 当使用 Scope.REQUEST  作用域的 provider 时， controller的作用域也会变成Scope.REQUEST
     */
    console.log('CoffeesController instantiated');
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Public(false)
  @Get()
  findAll() {
    return this.coffeesService.findAll();
  }

  @Public(true)
  @Get('/page')
  async findAllWithPagination(@Body() paginationQueryDto: PaginationQueryDto) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await this.coffeesService.findAllWithPagination(paginationQueryDto);
  }

  @Public(true)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}
