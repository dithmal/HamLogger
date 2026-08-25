import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  const prismaService = {
    $queryRaw: jest.fn().mockResolvedValue([{ connected: 1 }])
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prismaService
        }
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns a health payload', async () => {
    await expect(appController.getHealth()).resolves.toEqual({
      status: 'ok',
      service: 'hamlogger-server',
      database: 'ok'
    });
  });
});
