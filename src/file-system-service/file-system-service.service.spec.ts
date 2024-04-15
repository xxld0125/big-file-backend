import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemServiceService } from './file-system-service.service';

describe('FileSystemServiceService', () => {
  let service: FileSystemServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemServiceService],
    }).compile();

    service = module.get<FileSystemServiceService>(FileSystemServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
