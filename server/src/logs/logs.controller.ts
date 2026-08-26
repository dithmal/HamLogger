import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { CreateLogDto, ListLogsQueryDto, UpdateLogDto } from './dto/log.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) { }

  @Post()
  create(@Body() input: CreateLogDto) {
    return this.logsService.create(input);
  }

  @Get()
  findAll(@Query() query: ListLogsQueryDto) {
    return this.logsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateLogDto) {
    return this.logsService.update(id, input);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.logsService.remove(id);
  }
}
