import path from 'path';
import fs from 'fs';
import Client from 'ssh2-sftp-client';
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

const sftp = new Client();

const initial = async () => {
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: Number(process.env.SFTP_PORT),
    username: process.env.SFTP_USERNAME,
    privateKey: fs.readFileSync(process.env.SFTP_KEY_PATH),
  });
  const ret = await sftp.exists(process.env.SFTP_BASE_DIR);
  if (!ret) {
    await sftp.mkdir(process.env.SFTP_BASE_DIR, true);
  }
};

const readDir: ReadDirFunc = async (bucket, qpath) => {
  const rpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, qpath);
  const files = await sftp.list(rpath);
  const stats = files.map((file) => ({
    name: file.name,
    size: file.size,
    atime: new Date(file.accessTime),
    mtime: new Date(file.modifyTime),
    ctime: new Date(file.modifyTime),
    birthtime: new Date(file.modifyTime),
    isFile: file.type === '-',
  }));
  return stats;
};

const makeDir: MakeDirFunc = async (bucket, qpath) => {
  const rpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, qpath);
  const ret = await sftp.mkdir(rpath, true)
    .then(() => true)
    .catch(() => false);
  return ret;
};

const rmDirent: RmDirentFunc = async (bucket, qpath) => {
  const rpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, qpath);
  const isFile = await sftp.stat(rpath).then((stat) => stat.isFile).catch(() => null);
  if (isFile === null) {
    return false;
  }
  const ret =  isFile ? sftp.delete(rpath, true) : sftp.rmdir(rpath, true);
  return ret
    .then(() => true)
    .catch(() => false);
};

const getDirentInfo: GetDirentInfoFunc = async (bucket, qpath) => {
  const rpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, qpath);
  const fileName = qpath.split(path.posix.sep).at(-1) || '';
  const fileStat = await sftp.stat(rpath)
    .catch(() => null);
  if (!fileStat) {
    return null;
  }
  return {
    name: fileName,
    size: fileStat.size,
    atime: new Date(fileStat.accessTime),
    mtime: new Date(fileStat.modifyTime),
    ctime: new Date(fileStat.modifyTime),
    birthtime: new Date(fileStat.modifyTime),
    isFile: fileStat.isFile,
  };
};

const getFileReadStream: GetFileReadStreamFunc = async (bucket, qpath) => {
  const rpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, qpath);
  const isFile = await sftp.stat(rpath).then((stat) => stat.isFile).catch(() => false);
  if (!isFile) {
    return null;
  }
  const rs = sftp.createReadStream(rpath);
  return rs;
};

const uploadFile: UploadFileFunc = async (bucket, qpath, filename, tmpPath) => {
  const rpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, qpath, filename);
  const ret = await sftp.put(tmpPath, rpath)
    .then(() => true)
    .catch(() => false);
  await fs.promises.rm(tmpPath, { force: true });
  return ret;
};

const mvDirent: MvDirentFunc = async (bucket, srcPath, destPath) => {
  const srcRpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, srcPath);
  const destRpath = path.posix.join(process.env.SFTP_BASE_DIR, bucket.name, destPath);
  const ret = await sftp.rename(srcRpath, destRpath)
    .then(() => true)
    .catch(() => false);
  return ret;
};

const SFTPBag: FileSystemFuncBag = {
  initial,
  readDir,
  makeDir,
  rmDirent,
  getDirentInfo,
  getFileReadStream,
  uploadFile,
  mvDirent,
};

export default SFTPBag;
