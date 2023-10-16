import { Readable } from 'stream';
import { Bucket } from 'src/db';
import { DirentInfo, FileSystemFuncBag } from './type';
import OSFSBag from './OSFileSystem';
import SFTPBag from './SFTPSystem';
import EndPointBag from './EndPoint';

type FSType = 'OS' | 'S3' | 'FTP' | 'EP';

type FSMapper = { [key in FSType]: FileSystemFuncBag };

const defaultFSBag: FileSystemFuncBag = {
  initial: async () => {},
  readDir: async () => [],
  makeDir: async () => true,
  rmDirent: async () => true,
  getDirentInfo: async () => null,
  getFileReadStream: async () => null,
  uploadFile: async () => true,
  mvDirent: async () => true,
};

export const funcBagMapper: FSMapper = {
  OS: OSFSBag,
  S3: defaultFSBag,
  FTP: SFTPBag,
  EP: EndPointBag,
};

export const readDir = async (bucket: string, path: string): Promise<DirentInfo[]> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].readDir(bk, path);
};

export const makeDir = async (bucket: string, path: string): Promise<boolean> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].makeDir(bk, path);
};

export const rmDirent = async (bucket: string, path: string): Promise<boolean> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].rmDirent(bk, path);
};

export const getDirentInfo = async (bucket: string, path: string): Promise<DirentInfo | null> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].getDirentInfo(bk, path);
};

export const getFileReadStream = async (bucket: string, path: string): Promise<Readable | null> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].getFileReadStream(bk, path);
};

export const uploadFile = async (bucket: string, path: string, filename: string, tmpPath: string): Promise<boolean> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].uploadFile(bk, path, filename, tmpPath);
};

export const mvDirent = async (bucket: string, srcPath: string, destPath: string): Promise<boolean> => {
  const bk = await Bucket.getBucket(bucket);
  if (!bk) {
    throw new Error('Bucket not found');
  }
  return funcBagMapper[bk.type].mvDirent(bk, srcPath, destPath);
};
