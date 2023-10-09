import { Router } from 'express';
import passwdHash from 'password-hash';
import { AuthIO } from 'common';
import makeRouter from './makeRouter';
import { User } from 'src/db';
import { loginUser } from 'src/util/session';

const router = makeRouter(Router());

router.post<AuthIO.Login>('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (typeof userId !== 'string' || typeof password !== 'string') {
    return res.status(400).send();
  }
  const user = await User.getUser(userId);
  if (!user) {
    return res.status(401).send();
  }
  const ret = passwdHash.verify(password, user.password);
  if (!ret) {
    return res.status(401).send();
  }
  const token = loginUser(user);
  res.send({
    token,
    name: user.name,
  });
});

export default router;
