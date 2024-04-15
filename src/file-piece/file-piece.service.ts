import { Injectable } from '@nestjs/common';
import { FileSystemServiceService } from '../file-system-service/file-system-service.service';
import path from 'path';
import { isPositiveInter } from '../utils/file';

const COMBINE_FILE_NAME = 'combine';

@Injectable()
export class FilePieceService {
  constructor(
    private readonly hash: string,
    private readonly storageRoot: string,
    private readonly fileSystemServiceService: FileSystemServiceService,
  ) {
    this.hash = hash;
    this.storageRoot = storageRoot;
  }

  // 文件的地址
  get hashDir() {
    const { storageRoot, hash } = this;
    return path.resolve(storageRoot, hash);
  }
  // 查询当前文件目录, 没有就创建一个
  ensureHashDir() {
    const { hashDir } = this;
    return this.fileSystemServiceService.ensureDir(hashDir);
  }

  // 判断文件是否存在
  isExist(chunkIndex: number) {
    const findByChunk = typeof chunkIndex === 'number' && chunkIndex >= 0;

    return this.fileSystemServiceService.isFileExists(
      path.resolve(
        this.hashDir,
        findByChunk ? String(chunkIndex) : COMBINE_FILE_NAME,
      ),
    );
  }

  // 将文件分片写入缓存
  async writePiece(content: Buffer, index: number) {
    const { fileSystemServiceService } = this;
    const pieceFilename = path.resolve(this.hashDir, `${index}`);
    await this.ensureHashDir();
    await fileSystemServiceService.writeFile(pieceFilename, content);
  }

  async merge() {
    const { fileSystemServiceService } = this;
    // 获取指定目录下的文件分片地址
    const pieces = await fileSystemServiceService.ls(this.hashDir);
    // 用于从文件名中提取出文件序号
    const fn2idx = (filename) => +path.basename(filename);
    // 过滤出有效的文件分片，并按文件序号从小到大排序
    const sortedPieces = pieces
      .filter((r) => isPositiveInter(fn2idx(r)))
      .sort((r1, r2) => fn2idx(r1) - fn2idx(r2));

    // 如果没有找到任何文件分片，则抛出错误
    if (sortedPieces.length <= 0) {
      throw new Error(`Can not found any pieces of ${this.hash} `);
    }

    // 合并所有文件分片为一个完整的文件
    const filename = path.resolve(this.hashDir, COMBINE_FILE_NAME);
    await fileSystemServiceService.combine(sortedPieces, filename);

    // 返回合并后的文件信息，包括文件数量和哈希值
    return { count: pieces.length, hash: this.hash };
  }
}
