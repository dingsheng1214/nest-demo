import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';
import { CustomException } from '../common/exception/custom.exception';
import { HttpExceptionFilter } from '../common/filter/http-exception.filter';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('cats')
export class CatsController {
  // 基于属性的注入
  @Inject()
  private readonly catsService: CatsService;

  // 基于构造器的注入
  // constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  // http
  @Get('/getByName')
  async find(@Query('name') name: string): Promise<Cat[]> {
    return this.catsService.find(name);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() cat: UpdateCatDto) {
    return this.catsService.update(id, cat);
  }

  /**
   * {
   *     "message": "Forbidden",
   *     "statusCode": 403
   * }
   */
  @Get('/demo/error1')
  getError1() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  /**
   * 自定义返回字段
   * {
   *     "error": "this is a custom message",
   *     "status": 403
   * }
   */
  @Get('/demo/error2')
  getError2() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'this is a custom message',
      },
      HttpStatus.FORBIDDEN,
    );
  }

  @Get('/demo/error3')
  getError3() {
    throw new CustomException();
  }

  /**
   * 异常过滤器
   * {
   *     "path": "/cats/demo/error4",
   *     "statusCode": 403,
   *     "timestamp": "2022-03-21T14:35:05.483Z"
   * }
   */
  @Get('/demo/error4')
  @UseFilters(HttpExceptionFilter)
  getError4() {
    throw new CustomException();
  }
}
