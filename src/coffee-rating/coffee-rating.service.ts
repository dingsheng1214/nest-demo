import { Inject, Injectable } from '@nestjs/common';
import { CoffeesService } from '../coffees/coffees.service';

@Injectable()
export class CoffeeRatingService {
  @Inject()
  private readonly coffeesService: CoffeesService;
}
