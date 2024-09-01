import { Injectable } from '@nestjs/common';
import { AppConfigService } from './app-config/app-config.service';

@Injectable()
export class AppService {
  constructor(private readonly appConfigService: AppConfigService) {}

  getHello(): string {
    return 'Hello world';
  }
}
