import {
  UseInterceptors,
  Controller,
  Get,
  Post,
  Injectable,
  Query,
  Body,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import { FilePieceServiceProvider } from './file-piece.service.provider';

interface CheckParams {
  hash: string;
  index: string;
}

interface saveChunkParams {
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

  @Post('/save-chunk')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'chunk' }]))
  async saveChunk(
    @Body() body: saveChunkParams,
    @UploadedFiles()
    files: {
      chunk: MemoryStorageFile[];
    },
  ): Promise<boolean> {
    try {
      const { index, hash } = body;
      const { chunk } = files;

      const filePieceService =
        this.filePieceServiceProvider.createFilePieceService(hash);
      await filePieceService.writePiece(chunk[0].buffer, +index);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Get('/merge')
  async merge(@Query('hash') hash: string): Promise<boolean> {
    const filePieceService =
      this.filePieceServiceProvider.createFilePieceService(hash);

    try {
      filePieceService.merge();
      return true;
    } catch (e) {
      return false;
    }
  }
}
