import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import makeRouter from './makeRouter';
import { StorageIO } from 'common/index';
import { Bucket, ShareToken } from 'src/db';
import { getFileReadStream, makeDir, readDir, rmDirent, uploadFile } from 'src/fsHelper';

const router = makeRouter(Router());

router.post<StorageIO.ReadDir>('/readdir', async (req, res) => {
  const { bucket, path: _path, sToken } = req.body;
  if (typeof bucket !== 'string' || typeof _path !== 'string') {
    return res.status(400).send();
  }
  let hasPerm = req.user.userId === bucket || (await Bucket.isBucketMember(bucket, req.user.id));
  let rPath = _path;
  if (!hasPerm) {
    if (typeof sToken !== 'string') {
      return res.status(403).send();
    }
    const bucket = await ShareToken.getBucket(sToken);
    if (!bucket) {
      return res.status(403).send();
    }
    rPath = path.join(bucket.basePath, rPath);
    hasPerm = true;
  }
  if (!hasPerm) {
    return res.status(403).send();
  }
  const result = await readDir(bucket, rPath);
  return res.send({ result });
});

router.get<StorageIO.Download>('/download', async (req, res) => {
  const { bucket, path: _path, sToken } = req.query;
  if (typeof bucket !== 'string' || typeof _path !== 'string') {
    return res.status(400).send();
  }
  let hasPerm = req.user.userId === bucket || (await Bucket.isBucketMember(bucket, req.user.id));
  let rPath = _path;
  if (!hasPerm) {
    if (typeof sToken !== 'string') {
      return res.status(403).send();
    }
    const bucket = await ShareToken.getBucket(sToken);
    if (!bucket) {
      return res.status(403).send();
    }
    rPath = path.join(bucket.basePath, rPath);
    hasPerm = true;
  }
  const rs = await getFileReadStream(bucket, rPath);
  if (!rs) {
    return res.status(404).send();
  }
  return rs.pipe(res);
});

router.post<StorageIO.Mkdir>('/mkdir', async (req, res) => {
  const { bucket, path: _path } = req.body;
  if (typeof bucket !== 'string' || typeof _path !== 'string') {
    return res.status(400).send();
  }
  const hasPerm = req.user.userId === bucket || (await Bucket.isBucketMember(bucket, req.user.id));
  if (!hasPerm) {
    return res.status(403).send();
  }
  const result = await makeDir(bucket, _path);
  return res.status(result ? 200 : 400).send();
});

router.post<StorageIO.RmDirent>('/rm', async (req, res) => {
  const { bucket, path: _path } = req.body;
  if (typeof bucket !== 'string' || typeof _path !== 'string') {
    console.log('1111');
    return res.status(400).send();
  }
  const hasPerm = req.user.userId === bucket || (await Bucket.isBucketMember(bucket, req.user.id));
  if (!hasPerm) {
    return res.status(403).send();
  }
  const result = await rmDirent(bucket, _path);
  return res.status(result ? 200 : 400).send();
});

router.get<StorageIO.BucketLst>('/bucketlist', async (req, res) => {
  const buckets = await Bucket.getBucketList(req.user.id);
  return res.send({
    buckets: buckets.map((bucket) => ({
      name: bucket.name,
      type: bucket.type,
      ownerName: bucket.owner.name,
    })),
  });
});

const uploadHandler = multer({
  storage: multer.diskStorage({
    destination: process.env.MULTER_PATH,
    filename: (req, file, cb) => {
      cb(null, uuid() + path.extname(file.originalname));
    },
  }),
});

router.post<StorageIO.Upload>('/upload', uploadHandler.fields([
  { name: 'file' },
  { name: 'bucket' },
  { name: 'path' },
  { name: 'filename' },
]), async (req, res) => {
  const { bucket, path: _path, filename } = req.body;
  if (typeof bucket !== 'string' || typeof _path !== 'string' || typeof filename !== 'string') {
    return res.status(400).send();
  }
  const hasPerm = req.user.userId === bucket || (await Bucket.isBucketMember(bucket, req.user.id));
  if (!hasPerm) {
    return res.status(403).send();
  }
  if (Array.isArray(req.files) || typeof req.files === 'undefined') {
    return res.status(400).send();
  }
  const [file] = req.files.file;
  if (!file) {
    return res.status(400).send();
  }
  const ret = await uploadFile(bucket, _path, filename, file.path);
  res.status(ret ? 200 : 400).send();
});

export default router;
