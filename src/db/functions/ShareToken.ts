import Bucket from '../models/Bucket';
import ShareToken from '../models/ShareToken';

export const getBucket = async (token: string) => ShareToken.findOne({
  include: [{
    model: Bucket,
    required: true,
  }],
  where: {
    token,
  },
});
