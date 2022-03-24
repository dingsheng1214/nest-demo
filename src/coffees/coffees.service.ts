import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  // Repository是对数据源的抽象，并公开了各种有用的方法来操作数据
  @InjectRepository(Coffee)
  private coffeeRepository: Repository<Coffee>;

  @InjectRepository(Flavor)
  private flavorRepository: Repository<Flavor>;

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

    return this.coffeeRepository.save(coffee);
  }

  findAll() {
    return this.coffeeRepository.find({
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
}
