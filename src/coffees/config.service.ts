import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {}

@Injectable()
export class DevelopmentConfigService extends ConfigService {
  constructor() {
    super();
    console.log('DevelopmentConfigService');
  }
}

@Injectable()
export class ProductionConfigService extends ConfigService {
  constructor() {
    super();
    console.log('ProductionConfigService');
  }
}
