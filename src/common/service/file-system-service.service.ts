import { Injectable } from '@nestjs/common';
import * as path from 'path';
import {
  stat,
  readFile,
  writeFile,
  mkdir,
  readdir,
  unlink,
  access,
  lstat,
  rmdir,
} from 'fs/promises';
import { isValidString } from '../../utils/file';

@Injectable()
export class FileSystemService {
  // 检查文件是否存在
  async isFileExists(filename: string): Promise<boolean> {
    try {
      // 获取文件状态信息
      const fStat = await stat(filename);
      // 判断是否为文件
      return fStat.isFile();
    } catch (e) {
      return false;
    }
  }

  // 检查目录是否存在
  async isDirExists(filename: string) {
    try {
      // 获取文件状态信息
      const fStat = await stat(filename);
      // 判断是否为目录
      return fStat.isDirectory();
    } catch (e) {
      return false;
    }
  }

  // 列出目录下的所有文件和子目录
  async ls(dir: string) {
    if (await this.isDirExists(dir)) {
      // 读取目录内容
      const res = await readdir(dir);
      // 将相对路径转换为绝对路径
      return res.map((r) => path.resolve(dir, r));
    }
    throw new Error(`Dir ${dir} not exists`);
  }

  // 读取文件内容
  readFile(filename: string) {
    return readFile(filename);
  }

  // 写入文件内容
  async writeFile(filename: string, content: Buffer) {
    await writeFile(filename, content);
  }

  // 创建目录, 如果目录已存在则不会报错
  async ensureDir(dir: string) {
    await mkdir(dir, { recursive: true });
  }

  // 将多个文件内容合并并存为一个文件
  async combine(files: string[], saveAs: string) {
    // 检查输入的文件路径是否有效，防止无效路径导致错误
    // 如果任何一个文件路径无效，或者保存路径无效，则抛出错误
    if (files?.some((r) => !isValidString(r)) || !isValidString(saveAs)) {
      throw new Error(`Invalid file paths`);
    }

    const contents = await Promise.all(
      files.map(async (r) => {
        // 检查文件是否存在，如果文件不存在则抛出错误
        if ((await this.isFileExists(r)) !== true) {
          throw new Error(`file ${r} not exists`);
        }
        return this.readFile(r);
      }),
    );

    // 将所有文件内容合并为一个 Buffer
    const combinedContent = Buffer.concat(contents);
    // 将合并后的内容写入到指定的文件中
    await this.writeFile(saveAs, combinedContent);
  }

  async batchDeleteFiles(filePaths) {
    await Promise.all(
      filePaths.map(async (filePath) => {
        await unlink(filePath);
      }),
    );
  }

  // 批量删除指定目录下的所有文件及文件夹
  async deleteFolderRecursive(folderPath) {
    try {
      // 检查文件夹是否存在
      await access(folderPath);

      // 读取文件夹中的所有文件和子文件夹
      const files = await readdir(folderPath);

      // 遍历文件夹中的所有文件和子文件夹
      for (const file of files) {
        const curPath = path.join(folderPath, file);
        const stats = await lstat(curPath);

        // 如果是文件夹，则递归删除文件夹
        if (stats.isDirectory()) {
          await this.deleteFolderRecursive(curPath);
        } else {
          // 如果是文件，则直接删除文件
          await unlink(curPath);
        }
      }

      // 删除空文件夹
      await rmdir(folderPath);
    } catch (error) {
      console.error('delete folder failed:', error);
    }
  }
}
