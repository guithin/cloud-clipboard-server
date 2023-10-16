import { Router } from 'express';

const router = Router();

router.post('/enable', (req, res) => {
  const { uuid } = req.body;
  res.send({ result: true });
});

export default router;
