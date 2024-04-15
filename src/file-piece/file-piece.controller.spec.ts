import { Test, TestingModule } from '@nestjs/testing';
import { FilePieceController } from './file-piece.controller';
import { FilePieceService } from './file-piece.service';

describe('FilePieceController', () => {
  let controller: FilePieceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilePieceController],
      providers: [FilePieceService],
    }).compile();

    controller = module.get<FilePieceController>(FilePieceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
