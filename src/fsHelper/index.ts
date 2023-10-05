import { Readable } from 'stream';
import { DirentInfo, FileSystemFuncBag } from './type';
import OSFSBag from './OSFileSystem';
import { Bucket } from 'src/db';

type FSType = 'OS' | 'S3' | 'FTP';

type FSMapper = { [key in FSType]: FileSystemFuncBag };

const defaultFSBag: FileSystemFuncBag = {
  readDir: async () => [],
  makeDir: async () => true,
  rmDirent: async () => true,
  getDirentInfo: async () => null,
  getFileReadStream: async () => null,
};

export const funcBagMapper: FSMapper = {
  'OS': OSFSBag,
  'S3': defaultFSBag,
  'FTP': defaultFSBag,
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
