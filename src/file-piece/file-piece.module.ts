import { Module } from '@nestjs/common';
import { FilePieceServiceProvider } from './file-piece.service.provider';
import { FileSystemService } from '../common/service/file-system-service.service';
import { FilePieceService } from './file-piece.service';
import { FilePieceController } from './file-piece.controller';

@Module({
  controllers: [FilePieceController],
  providers: [FileSystemService, FilePieceServiceProvider, FilePieceService],
  exports: [FilePieceServiceProvider],
})
export class FilePieceModule {}
