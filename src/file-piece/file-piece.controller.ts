import { Controller, Get, Injectable, Query, Body } from '@nestjs/common';
import { FilePieceServiceProvider } from './file-piece.service.provider';

interface CheckParams {
  hash: string;
  index: string;
}

@Injectable()
@Controller('file-piece')
export class FilePieceController {
  constructor(
    private readonly filePieceServiceProvider: FilePieceServiceProvider,
  ) {}
  @Get('/check')
  async find(@Query() query: CheckParams): Promise<boolean> {
    const { hash, index } = query;

    const filePieceService =
      this.filePieceServiceProvider.createFilePieceService(hash);

    return await filePieceService.isExist(+index);
  }
}
