import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    const [{ connected }] = await this.prisma.$queryRaw<[{ connected: number }]>`
      SELECT 1::int AS connected
    `;

    return {
      status: 'ok',
      service: 'hamlogger-server',
      database: connected === 1 ? 'ok' : 'unknown'
    };
  }
}
