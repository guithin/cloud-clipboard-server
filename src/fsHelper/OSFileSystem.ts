import fs from 'fs';
import path from 'path';
import {
  FileSystemFuncBag,
  GetDirentInfoFunc,
  GetFileReadStreamFunc,
  MakeDirFunc,
  MvDirentFunc,
  ReadDirFunc,
  RmDirentFunc,
  UploadFileFunc,
} from './type';

const initial = async () => {
  const isExists = await fs.promises.stat(process.env.BASE_DIR)
    .then(() => true)
    .catch(() => false);
  if (!isExists) {
    await fs.promises.mkdir(process.env.BASE_DIR, { recursive: true });
  }
};

const readDir: ReadDirFunc = async (bucket, qpath) => {
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

const makeDir: MakeDirFunc = (bucket, qpath) => new Promise((resolve) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  fs.promises.mkdir(rpath)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

const rmDirent: RmDirentFunc = (bucket, qpath) => new Promise((resolve) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  fs.promises.rm(rpath, { recursive: true, force: true })
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

const getDirentInfo: GetDirentInfoFunc = async (bucket, qpath) => new Promise((resolve) => {
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

const getFileReadStream: GetFileReadStreamFunc = async (bucket, qpath) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath);
  const isFile = await fs.promises.stat(rpath).then((fileStat) => fileStat.isFile()).catch(() => false);
  if (!isFile) {
    return null;
  }
  return fs.createReadStream(rpath);
};

const uploadFile: UploadFileFunc = async (bucket, qpath, filename, tmpPath) => new Promise((resolve) => {
  const rpath = path.join(process.env.BASE_DIR, bucket.name, qpath, filename);
  fs.promises.rename(tmpPath, rpath)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

const mvDirent: MvDirentFunc = (bucket, srcPath, destPath) => new Promise((resolve) => {
  const rsrcPath = path.join(process.env.BASE_DIR, bucket.name, srcPath);
  const rdestPath = path.join(process.env.BASE_DIR, bucket.name, destPath);
  fs.promises.rename(rsrcPath, rdestPath)
    .then(() => resolve(true))
    .catch(() => resolve(false));
});

const OSFSBag: FileSystemFuncBag = {
  initial,
  readDir,
  makeDir,
  rmDirent,
  getDirentInfo,
  getFileReadStream,
  uploadFile,
  mvDirent,
};

export default OSFSBag;
