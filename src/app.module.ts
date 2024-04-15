import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './utils';
import { FileSystemServiceService } from './file-system-service/file-system-service.service';
import { FilePieceModule } from './file-piece/file-piece.module';
import { FileSystemServiceModule } from './file-system-service/file-system-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    FilePieceModule,
    FileSystemServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileSystemServiceService],
})
export class AppModule {}
