import { Module } from '@nestjs/common';
import { FileSystemServiceService } from './file-system-service.service';

@Module({
  providers: [FileSystemServiceService],
  exports: [FileSystemServiceService],
})
export class FileSystemServiceModule {}
