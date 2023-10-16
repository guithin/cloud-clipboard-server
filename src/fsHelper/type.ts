import { Readable } from 'stream';
import Bucket from 'src/db/models/Bucket';

export interface DirentInfo {
  name: string;
  size: number;
  atime: Date; // access time
  mtime: Date; // modify time
  ctime: Date; // change time
  birthtime: Date; // create time
  isFile: boolean;
}

export type ReadDirFunc = (bucket: Bucket, path: string) => Promise<DirentInfo[]>;

export type MakeDirFunc = (bucket: Bucket, path: string) => Promise<boolean>;

export type RmDirentFunc = (bucket: Bucket, path: string) => Promise<boolean>;

export type GetDirentInfoFunc = (bucket: Bucket, path: string) => Promise<DirentInfo | null>;

export type GetFileReadStreamFunc = (bucket: Bucket, path: string) => Promise<Readable | null>;

export type UploadFileFunc = (bucket: Bucket, path: string, filename: string, tmpPath: string) => Promise<boolean>;

export type MvDirentFunc = (bucket: Bucket, srcPath: string, destPath: string) => Promise<boolean>;

export interface FileSystemFuncBag {
  readDir: ReadDirFunc;
  makeDir: MakeDirFunc;
  rmDirent: RmDirentFunc;
  getDirentInfo: GetDirentInfoFunc;
  getFileReadStream: GetFileReadStreamFunc;
  uploadFile: UploadFileFunc;
  mvDirent: MvDirentFunc;
}
