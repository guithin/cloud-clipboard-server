import fs from 'fs';
import path from 'path';
import {
  DirentInfo,
  FileSystemFuncBag,
  GetDirentInfoFunc,
  GetFileReadStreamFunc,
  MakeDirFunc,
  ReadDirFunc,
  RmDirentFunc,
} from './type';

export const readDir: ReadDirFunc = async (bucket, qpath) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  const files = await fs.promises.readdir(rpath).catch(() => []);
  const promises = files.map((file) => fs.promises.stat(path.join(rpath, file)).then((fileStat) => ({
    name: file,
    size: fileStat.size,
    atime: fileStat.atime,
    mtime: fileStat.mtime,
    ctime: fileStat.ctime,
    birthtime: fileStat.birthtime,
    isFile: fileStat.isFile(),
  })));
  const stats = await Promise.all(promises).catch(() => []);
  return stats;
};

export const makeDir: MakeDirFunc = (bucket, qpath) => new Promise((resolve) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  fs.promises.mkdir(rpath)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

export const rmDirent: RmDirentFunc = (bucket, qpath) => new Promise((resolve) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  fs.promises.unlink(rpath)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

export const getDirentInfo: GetDirentInfoFunc = async (bucket, qpath) => new Promise((resolve) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  const fileName = qpath.split(path.sep).at(-1) || '';
  fs.promises.stat(rpath)
    .then((fileStat) => resolve({
      name: fileName,
      size: fileStat.size,
      atime: fileStat.atime,
      mtime: fileStat.mtime,
      ctime: fileStat.ctime,
      birthtime: fileStat.birthtime,
      isFile: fileStat.isFile(),
    }))
    .catch(() => resolve(null));
});

export const getFileReadStream: GetFileReadStreamFunc = async (bucket, qpath) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  const isFile = await fs.promises.stat(rpath).then((fileStat) => fileStat.isFile()).catch(() => false);
  if (!isFile) {
    return null;
  }
  return fs.createReadStream(rpath);
};


const OSFSBag: FileSystemFuncBag = {
  readDir,
  makeDir,
  rmDirent,
  getDirentInfo,
  getFileReadStream,
};

export default OSFSBag;