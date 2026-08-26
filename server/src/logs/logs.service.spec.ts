import { NotFoundException } from '@nestjs/common';
import { Band, Prisma, QslReceivedStatus, QslSentStatus, type Log } from '@prisma/client';
import { LogsService } from './logs.service';
import { PrismaService } from '../prisma/prisma.service';

const log: Log = {
  id: '4f388ad5-02e9-4ba7-8919-1f6e532a81f4',
  call: 'K1ABC',
  qsoDate: new Date('2026-08-25T00:00:00.000Z'),
  timeOn: new Date('1970-01-01T14:30:00.000Z'),
  band: Band.B_20M,
  freq: new Prisma.Decimal('14.074'),
  mode: 'FT8',
  rstSent: '-10',
  rstRcvd: '-12',
  gridsquare: 'FN31PR',
  dxcc: 291,
  name: 'Alex',
  qth: 'Connecticut',
  propMode: null,
  submode: null,
  comment: null,
  stationCallsign: 'N0CALL',
  operator: 'N0CALL',
  qslRcvd: QslReceivedStatus.N,
  qslSent: QslSentStatus.N,
  qslRcvdVia: null,
  qslSentVia: null,
  qslRdate: null,
  qslSdate: null,
  createdAt: new Date('2026-08-25T14:30:00.000Z'),
  updatedAt: new Date('2026-08-25T14:30:00.000Z')
};

describe('LogsService', () => {
  const prisma = {
    log: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    $transaction: jest.fn(async (queries: Promise<unknown>[]) => Promise.all(queries))
  };
  const service = new LogsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a normalized contact', async () => {
    prisma.log.create.mockResolvedValue(log);

    const result = await service.create({
      call: 'K1ABC',
      qsoDate: '2026-08-25',
      timeOn: '14:30:00',
      band: Band.B_20M,
      freq: 14.074,
      mode: 'FT8',
      rstSent: '-10',
      rstRcvd: '-12',
      stationCallsign: 'N0CALL',
      operator: 'N0CALL'
    });

    expect(prisma.log.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          call: 'K1ABC',
          freq: new Prisma.Decimal('14.074')
        })
      })
    );
    expect(result).toMatchObject({ freq: '14.074', qsoDate: '2026-08-25', timeOn: '14:30:00' });
  });

  it('returns a compact, paginated contact list', async () => {
    prisma.log.findMany.mockResolvedValue([log]);
    prisma.log.count.mockResolvedValue(51);

    await expect(service.findAll({ page: 2, limit: 50 })).resolves.toEqual({
      data: [
        {
          id: log.id,
          call: 'K1ABC',
          freq: '14.074',
          mode: 'FT8',
          qsoDate: '2026-08-25',
          timeOn: '14:30:00',
          rstSent: '-10',
          rstRcvd: '-12'
        }
      ],
      page: 2,
      limit: 50,
      total: 51,
      totalPages: 2
    });
  });

  it('returns a 404 for a missing contact', async () => {
    prisma.log.findUnique.mockResolvedValue(null);

    await expect(service.findOne(log.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates and deletes an existing contact', async () => {
    prisma.log.findUnique.mockResolvedValue(log);
    prisma.log.update.mockResolvedValue({ ...log, comment: 'Worked via satellite' });

    await expect(service.update(log.id, { comment: 'Worked via satellite' })).resolves.toMatchObject({
      comment: 'Worked via satellite'
    });

    await service.remove(log.id);
    expect(prisma.log.delete).toHaveBeenCalledWith({ where: { id: log.id } });
  });
});
