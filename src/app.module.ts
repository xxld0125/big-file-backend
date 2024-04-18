import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from './utils';
import { FilePieceModule } from './file-piece/file-piece.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    FilePieceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
