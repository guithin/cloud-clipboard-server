import Bucket from '../models/Bucket';
import BucketMember from '../models/BucketMember';

export const isBucketMember = (bucketName: string, uid: number) => Bucket.findOne({
  include: [{
    model: BucketMember,
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