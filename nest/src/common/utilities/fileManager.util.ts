import * as fs from 'fs';
import * as path from 'path';
import { access, appendFile as append, stat, mkdir } from 'fs/promises';

type IUseFileManager = {
  readFile(srcPath: string): string | undefined;
  writeFile(srcPath: string, payload: string): Promise<void>;
  removeFile: (srcPath: string) => Promise<void>;
  accessFile: (srcPath: string) => Promise<boolean>;
  appendFile: (srcPath: string, payload: string) => Promise<void>;
  getFileSizeMB: (filePath: string) => Promise<number>;
  createDirectory: (dir: string) => Promise<void>;
};

function useFileManager(): IUseFileManager {
  async function accessFile(srcPath: string): Promise<boolean> {
    return access(srcPath)
      .then(() => true)
      .catch(() => false);
  }

  async function createDirectory(dir: string): Promise<void> {
    await mkdir(path.join(process.cwd(), dir), { recursive: true });
  }

  async function appendFile(srcPath: string, payload: string): Promise<void> {
    return append(srcPath, payload);
  }

  function readFile(srcPath: string): string | undefined {
    if (fs.existsSync(srcPath))
      return fs.readFileSync(srcPath, { encoding: 'utf8' });
    else return undefined;
  }

  async function writeFile(srcPath: string, payload: string): Promise<void> {
    await new Promise<void>(
      (
        resolve: (value: void | PromiseLike<void>) => void,
        reject: (reason?: any) => void,
      ) => {
        fs.writeFile(srcPath, payload, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            reject(`Could not write to file ${srcPath}.`);
          } else resolve();
        });
      },
    );
  }

  async function removeFile(srcPath: string): Promise<void> {
    await new Promise<void>(
      (
        resolve: (value: void | PromiseLike<void>) => void,
        reject: (reason?: any) => void,
      ) => {
        fs.rm(srcPath, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            reject(`Could not remove file ${srcPath}.`);
          } else resolve();
        });
      },
    );
  }

  async function getFileSizeMB(filePath: string): Promise<number> {
    const stats = await stat(filePath);
    return stats.size / (1024 * 1024);
  }

  return {
    readFile,
    writeFile,
    removeFile,
    accessFile,
    appendFile,
    getFileSizeMB,
    createDirectory,
  };
}

export { useFileManager };
