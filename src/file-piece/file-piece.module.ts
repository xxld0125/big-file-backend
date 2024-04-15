import { Module } from '@nestjs/common';
import { FilePieceService } from './file-piece.service';
import { FilePieceController } from './file-piece.controller';

@Module({
  controllers: [FilePieceController],
  providers: [FilePieceService],
})
export class FilePieceModule {}
