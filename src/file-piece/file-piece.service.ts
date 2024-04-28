import { FileSystemService } from '../common/service/file-system-service.service';
import * as path from 'path';
import { isPositiveInter } from '../utils/file';

const COMBINE_FILE_NAME = 'combine';

export class FilePieceService {
  constructor(
    private hash: string,
    private storageRoot: string,
    private fileSystemService: FileSystemService,
  ) {
    this.hash = hash;
    this.storageRoot = storageRoot;
    this.fileSystemService = fileSystemService;
  }

  // 文件的地址
  get hashDir() {
    const { storageRoot, hash } = this;
    return path.resolve(storageRoot, hash);
  }

  // 查询当前文件目录, 没有就创建一个
  ensureHashDir() {
    const { hashDir } = this;
    return this.fileSystemService.ensureDir(hashDir);
  }

  // 判断文件是否存在
  async isExist(chunkIndex: number): Promise<boolean> {
    const findByChunk = chunkIndex >= 0;
    return this.fileSystemService.isFileExists(
      path.resolve(
        this.hashDir,
        findByChunk ? String(chunkIndex) : COMBINE_FILE_NAME,
      ),
    );
  }

  // 将文件分片写入缓存
  async writePiece(content: Buffer, index: number) {
    const { fileSystemService } = this;
    const pieceFilename = path.resolve(this.hashDir, `${index}`);
    await this.ensureHashDir();
    await fileSystemService.writeFile(pieceFilename, content);
  }

  async merge() {
    const { fileSystemService } = this;
    // 获取指定目录下的文件分片地址
    const pieces = await fileSystemService.ls(this.hashDir);
    // 用于从文件名中提取出文件序号
    const fn2idx = (filename) => +path.basename(filename);
    // 过滤出有效的文件分片，并按文件序号从小到大排序(按顺序)
    const sortedPieces = pieces
      .filter((r) => isPositiveInter(fn2idx(r)))
      .sort((r1, r2) => fn2idx(r1) - fn2idx(r2));

    // 如果没有找到任何文件分片，则抛出错误
    if (sortedPieces.length <= 0) {
      throw new Error(`Can not found any pieces of ${this.hash} `);
    }

    // 合并所有文件分片为一个完整的文件
    const filename = path.resolve(this.hashDir, COMBINE_FILE_NAME);
    await fileSystemService.combine(sortedPieces, filename);

    // 合并后删除分片文件
    await fileSystemService.batchDeleteFiles(pieces);

    // 返回合并后的文件信息，包括文件数量和哈希值
    return { count: pieces.length, hash: this.hash };
  }

  async deleteFolderRecursive() {
    const { fileSystemService } = this;
    // 获取指定目录下的所有文件及文件夹
    await fileSystemService.deleteFolderRecursive(this.hashDir);
  }
}
