import { Test, TestingModule } from '@nestjs/testing';
import { FilePieceService } from './file-piece.service';

describe('FilePieceService', () => {
  let service: FilePieceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilePieceService],
    }).compile();

    service = module.get<FilePieceService>(FilePieceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
