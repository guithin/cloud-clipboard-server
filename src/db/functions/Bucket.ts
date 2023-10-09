import Bucket from '../models/Bucket';
import BucketMember from '../models/BucketMember';
import User from '../models/User';

export const isBucketMember = (bucketName: string, uid: number) => Bucket.findOne({
  include: [{
    model: BucketMember,
    as: 'members',
    required: true,
    where: {
      uid,
    },
  }],
  where: {
    name: bucketName,
  },
})
  .then((bucket) => !!bucket)
  .catch(() => false);

export const getBucket = (bucketName: string) => Bucket.findOne({
  where: {
    name: bucketName,
  },
});

export const getBucketList = (uid: number) => Bucket.findAll({
  include: [{
    model: BucketMember,
    as: 'members',
    required: true,
    where: {
      uid,
    },
  }, {
    model: User,
    as: 'owner',
    required: true,
  }],
});
