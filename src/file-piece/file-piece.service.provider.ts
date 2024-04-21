import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { FilePieceService } from './file-piece.service';
import { FileSystemService } from '../common/service/file-system-service.service';

const fileStorageRoot = path.resolve(__dirname, '../.cache');

@Injectable()
export class FilePieceServiceProvider {
  constructor(private fileSystemService: FileSystemService) {}

  createFilePieceService(hash: string) {
    return new FilePieceService(hash, fileStorageRoot, this.fileSystemService);
  }
}
