import { Controller, Get, Param } from '@nestjs/common';
import { FilePieceService } from './file-piece.service';
import path from 'path';

const storageRoot = path.resolve(__dirname, '../node_modules/.cache');

@Controller('file-piece')
export class FilePieceController {
  constructor(private readonly filePieceService: FilePieceService) {}

  @Get('check')
  async find(@Param() params) {
    const { hash, index } = params;
    return await this.filePieceService.isExist({ hash: hash!, storageRoot });
  }
}
