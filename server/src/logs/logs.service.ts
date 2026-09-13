import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Log } from '@prisma/client';
import { BulkUpdateQslDto, CreateLogDto, ListLogsQueryDto, UpdateLogDto } from './dto/log.dto';
import { PrismaService } from '../prisma/prisma.service';

const listSelect = {
  id: true,
  call: true,
  freq: true,
  mode: true,
  qsoDate: true,
  timeOn: true,
  rstSent: true,
  rstRcvd: true,
  qslRcvd: true,
  qslRdate: true,
  qslSent: true,
  qslSdate: true
} satisfies Prisma.LogSelect;

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateLogDto) {
    const log = await this.prisma.log.create({
      data: this.toCreateData(input)
    });

    return this.serializeLog(log);
  }

  async findAll(query: ListLogsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Prisma.LogWhereInput = {
      ...(query.call ? { call: { contains: query.call, mode: 'insensitive' } } : {}),
      ...(query.qslSent ? { qslSent: query.qslSent } : {}),
      ...(query.qslRcvd ? { qslRcvd: query.qslRcvd } : {}),
      ...(query.qsoDateFrom || query.qsoDateTo ? { qsoDate: { ...(query.qsoDateFrom ? { gte: this.toDate(query.qsoDateFrom) } : {}), ...(query.qsoDateTo ? { lte: this.toDate(query.qsoDateTo) } : {}) } } : {})
    };
    const [logs, total] = await this.prisma.$transaction([
      this.prisma.log.findMany({
        select: listSelect,
        where,
        orderBy: [{ qsoDate: 'desc' }, { timeOn: 'desc' }, { id: 'desc' }],
        skip,
        take: limit
      }),
      this.prisma.log.count({ where })
    ]);

    return {
      data: logs.map((log) => this.serializeListLog(log)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async bulkUpdateQsl(input: BulkUpdateQslDto) {
    const data: Prisma.LogUpdateManyMutationInput = {};
    if (input.qslRcvd !== undefined) data.qslRcvd = input.qslRcvd;
    if (input.qslSent !== undefined) data.qslSent = input.qslSent;
    if (input.qslRdate !== undefined) data.qslRdate = input.qslRdate ? this.toDate(input.qslRdate) : null;
    if (input.qslSdate !== undefined) data.qslSdate = input.qslSdate ? this.toDate(input.qslSdate) : null;

    const result = await this.prisma.log.updateMany({ where: { id: { in: input.ids } }, data });
    return { updated: result.count };
  }

  async findOne(id: string) {
    const log = await this.prisma.log.findUnique({ where: { id } });
    if (!log) {
      throw new NotFoundException(`Contact ${id} was not found`);
    }

    return this.serializeLog(log);
  }

  async update(id: string, input: UpdateLogDto) {
    await this.findOne(id);
    const log = await this.prisma.log.update({
      where: { id },
      data: this.toUpdateData(input)
    });

    return this.serializeLog(log);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.log.delete({ where: { id } });
  }

  private toCreateData(input: CreateLogDto): Prisma.LogCreateInput {
    return {
      call: input.call,
      qsoDate: this.toDate(input.qsoDate),
      timeOn: this.toTime(input.timeOn),
      band: input.band,
      freq: new Prisma.Decimal(input.freq),
      mode: input.mode,
      rstSent: input.rstSent,
      rstRcvd: input.rstRcvd,
      stationCallsign: input.stationCallsign,
      operator: input.operator,
      gridsquare: input.gridsquare,
      dxcc: input.dxcc,
      name: input.name,
      qth: input.qth,
      propMode: input.propMode,
      submode: input.submode,
      comment: input.comment,
      qslRcvd: input.qslRcvd,
      qslSent: input.qslSent,
      qslRcvdVia: input.qslRcvdVia,
      qslSentVia: input.qslSentVia,
      qslRdate: input.qslRdate ? this.toDate(input.qslRdate) : input.qslRdate,
      qslSdate: input.qslSdate ? this.toDate(input.qslSdate) : input.qslSdate
    };
  }

  private toUpdateData(input: UpdateLogDto): Prisma.LogUpdateInput {
    const data: Prisma.LogUpdateInput = {};

    if (input.call !== undefined) data.call = input.call;
    if (input.qsoDate !== undefined) data.qsoDate = this.toDate(input.qsoDate);
    if (input.timeOn !== undefined) data.timeOn = this.toTime(input.timeOn);
    if (input.band !== undefined) data.band = input.band;
    if (input.freq !== undefined) data.freq = new Prisma.Decimal(input.freq);
    if (input.mode !== undefined) data.mode = input.mode;
    if (input.rstSent !== undefined) data.rstSent = input.rstSent;
    if (input.rstRcvd !== undefined) data.rstRcvd = input.rstRcvd;
    if (input.gridsquare !== undefined) data.gridsquare = input.gridsquare;
    if (input.dxcc !== undefined) data.dxcc = input.dxcc;
    if (input.name !== undefined) data.name = input.name;
    if (input.qth !== undefined) data.qth = input.qth;
    if (input.propMode !== undefined) data.propMode = input.propMode;
    if (input.submode !== undefined) data.submode = input.submode;
    if (input.comment !== undefined) data.comment = input.comment;
    if (input.stationCallsign !== undefined) data.stationCallsign = input.stationCallsign;
    if (input.operator !== undefined) data.operator = input.operator;
    if (input.qslRcvd !== undefined) data.qslRcvd = input.qslRcvd;
    if (input.qslSent !== undefined) data.qslSent = input.qslSent;
    if (input.qslRcvdVia !== undefined) data.qslRcvdVia = input.qslRcvdVia;
    if (input.qslSentVia !== undefined) data.qslSentVia = input.qslSentVia;
    if (input.qslRdate !== undefined) data.qslRdate = input.qslRdate ? this.toDate(input.qslRdate) : null;
    if (input.qslSdate !== undefined) data.qslSdate = input.qslSdate ? this.toDate(input.qslSdate) : null;

    return data;
  }

  private toDate(value: string): Date {
    return new Date(`${value}T00:00:00.000Z`);
  }

  private toTime(value: string): Date {
    return new Date(`1970-01-01T${value}.000Z`);
  }

  private serializeListLog(log: Prisma.LogGetPayload<{ select: typeof listSelect }>) {
    return {
      id: log.id,
      call: log.call,
      freq: log.freq.toString(),
      mode: log.mode,
      qsoDate: this.formatDate(log.qsoDate),
      timeOn: this.formatTime(log.timeOn),
      rstSent: log.rstSent,
      rstRcvd: log.rstRcvd,
      qslRcvd: log.qslRcvd,
      qslRdate: log.qslRdate ? this.formatDate(log.qslRdate) : null,
      qslSent: log.qslSent,
      qslSdate: log.qslSdate ? this.formatDate(log.qslSdate) : null
    };
  }

  private serializeLog(log: Log) {
    return {
      ...log,
      freq: log.freq.toString(),
      qsoDate: this.formatDate(log.qsoDate),
      timeOn: this.formatTime(log.timeOn),
      qslRdate: log.qslRdate ? this.formatDate(log.qslRdate) : null,
      qslSdate: log.qslSdate ? this.formatDate(log.qslSdate) : null
    };
  }

  private formatDate(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  private formatTime(value: Date): string {
    return value.toISOString().slice(11, 19);
  }
}
