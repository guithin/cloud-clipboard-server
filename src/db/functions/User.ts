import User from '../models/User';

export const getUser = (userId: string) => User.findOne({
  where: {
    userId,
  },
});
