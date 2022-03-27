import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Connection, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { ConfigService } from './config.service';

@Injectable()
export class CoffeesService {
  // Repository是对数据源的抽象，并公开了各种有用的方法来操作数据
  @InjectRepository(Coffee)
  private coffeeRepository: Repository<Coffee>;

  @InjectRepository(Flavor)
  private flavorRepository: Repository<Flavor>;

  @Inject()
  private readonly connection: Connection;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  // constructor(
  //   @InjectRepository(Coffee)
  //   private readonly coffeeRepository: Repository<Coffee>,
  // ) {}
  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await this.flavorRepository.findBy({
      id: In(createCoffeeDto.flavorIds),
    });

    const coffee = new Coffee();
    coffee.name = createCoffeeDto.name;
    coffee.brand = createCoffeeDto.brand;
    // 一并将关联数据 插入 coffee_flavors_flavor 关联表中
    coffee.flavors = flavors;

    return this.recommendCoffee(coffee);
  }

  findAll() {
    return this.coffeeRepository.find({
      relations: ['flavors'],
    });
  }

  findAllWithPagination(paginationQueryDto: PaginationQueryDto) {
    return this.coffeeRepository.find({
      take: paginationQueryDto.limit,
      skip: paginationQueryDto.offset,
      relations: ['flavors'],
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    await this.findOne(id);
    const flavors = await this.flavorRepository.findBy({
      id: In(updateCoffeeDto.flavorIds),
    });
    const coffee = new Coffee();
    coffee.id = id;
    coffee.name = updateCoffeeDto.name;
    coffee.brand = updateCoffeeDto.brand;
    // 一并更新 coffee_flavors_flavor 关联表
    coffee.flavors = flavors;

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: id },
      relations: ['flavors'], // 会一并删除 关联表中的数据
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(coffee);

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: result.id };

      // throw new Error('111');
      await queryRunner.manager.save(recommendEvent);
      // 提交事务
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      console.log('111', err);
      //如果遇到错误，可以回滚事务
      await queryRunner.rollbackTransaction();
    } finally {
      // 确保最终释放 queryRunner
      await queryRunner.release();
    }
  }
}
