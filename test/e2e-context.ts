import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppConfigService } from '../src/appconfig/app-config.service';
import { AppModule } from '../src/app.module';

export interface E2EContext {
  app: INestApplication;
}

export function setupE2EContext(updateBuilder?: (builder: TestingModuleBuilder) => TestingModuleBuilder): E2EContext {
  let mongoServer: MongoMemoryServer;

  let context: E2EContext = { app: null };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({ instance: { portGeneration: true } });

    let builder: TestingModuleBuilder = Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppConfigService)
      .useValue({
        mongoDbUrl: mongoServer.getUri(),
        openaiKey: '',
      });

    if (updateBuilder) {
      builder = updateBuilder(builder);
    }

    const module: TestingModule = await builder.compile();
    const app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );

    await app.init();

    context.app = app;
  });

  afterAll(async () => {
    await mongoServer.stop();
    await context.app.close();
  });

  return context;
}
