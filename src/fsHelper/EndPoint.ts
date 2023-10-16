import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { FileSystemFuncBag, GetFileReadStreamFunc, MakeDirFunc, MvDirentFunc, ReadDirFunc, RmDirentFunc, UploadFileFunc } from './type';

const bucketToUUID: {
  [key: string]: string;
} = {
  'test': '80f871dd-527f-42ae-90af-261ee3e55a79',
};

const testURL = 'http://127.0.0.1:8080/'

const readDir: ReadDirFunc = async (bucket, qpath) => {
  const res = await axios.post(testURL + 'readdir', {
    uuid: bucketToUUID[bucket.name],
    qpath,
  });
  return res.data;
};

const makeDir: MakeDirFunc = async (bucket, qpath) => {
  const res = await axios.post(testURL + 'mkdir', {
    uuid: bucketToUUID[bucket.name],
    qpath,
  });
  return res.data === 'success';
};

const rmDirent: RmDirentFunc = async (bucket, qpath) => {
  const res = await axios.post(testURL + 'rm', {
    uuid: bucketToUUID[bucket.name],
    qpath,
  });
  return res.data === 'success';
};

const uploadFile: UploadFileFunc = async (bucket, qpath, filename, file) => {
  const formData = new FormData();
  formData.append('uuid', bucketToUUID[bucket.name]);
  formData.append('qpath', qpath);
  formData.append('file', fs.createReadStream(file));
  formData.append('filename', filename);
  const res = await axios.post(testURL + 'upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(res.data);
  return res.data === 'success';
};

const mvDirent: MvDirentFunc = async (bucket, srcPath, destPath) => {
  const res = await axios.post(testURL + 'mv', {
    uuid: bucketToUUID[bucket.name],
    srcPath,
    destPath,
  });
  return res.data === 'success';
};

const getFileReadStream: GetFileReadStreamFunc = async (bucket, qpath) => {
  const res = await axios.post(testURL + 'download', {
    uuid: bucketToUUID[bucket.name],
    qpath,
  }, {
    responseType: 'stream',
  });
  return res.data;
};

const EndPointBag: FileSystemFuncBag = {
  initial: async () => {},
  readDir,
  makeDir,
  rmDirent,
  getDirentInfo: async () => null,
  getFileReadStream,
  uploadFile,
  mvDirent,
};

export default EndPointBag;
