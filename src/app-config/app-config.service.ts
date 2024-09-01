import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly mongoDbUrl: string;
  public readonly port: number;

  constructor(private nestConfigService: NestConfigService) {
    this.mongoDbUrl = this.nestConfigService.getOrThrow<string>('MONGODB_URL');
    this.port = this.nestConfigService.getOrThrow<number>('PORT');
  }
}
