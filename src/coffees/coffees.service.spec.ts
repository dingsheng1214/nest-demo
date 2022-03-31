import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Connection, Repository } from 'typeorm';
import { ConfigService } from './config.service';
import { NotFoundException } from '@nestjs/common';

// 伪造
class CoffeeRepositoryFake {
  public create(): void {}
  public async save(): Promise<void> {}
  public async remove(): Promise<void> {}
  public async findOne(): Promise<void> {}
}

describe('CoffeesService', () => {
  let coffeesService: CoffeesService;
  let coffeeRepository: Repository<Coffee>;

  beforeEach(async () => {
    // 类似于@Module({})
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        ConfigService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Coffee),
          useClass: CoffeeRepositoryFake,
        },
        { provide: getRepositoryToken(Flavor), useValue: {} },
      ],
    }).compile();

    coffeesService = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(coffeesService).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const id = 1;
        const expectedCoffee = new Coffee();

        // mock coffeeRepository.findOne() return expectedCoffee
        jest
          .spyOn(coffeeRepository, 'findOne')
          .mockResolvedValue(expectedCoffee);

        const coffee = await coffeesService.findOne(id);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the NotFoundException', async () => {
        const id = 1;
        jest.spyOn(coffeeRepository, 'findOne').mockResolvedValue(undefined);

        try {
          await coffeesService.findOne(id);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
