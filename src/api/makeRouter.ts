import { ExTypes } from 'common/interfaces/base';
import { RequestHandler, Router } from 'express';

type Method = 'get' | 'post' | 'put';

const handler = <M extends Method>(_r: Router, m: M) => <T extends ExTypes>(path: string, ...func: RequestHandler<T['P'], T['ResB'], T['ReqB'], T['ReqQ'], T['Locs']>[]) => {
  _r[m](path, ...func);
};

export default (_r: Router) => ({
  get: handler(_r, 'get'),
  post: handler(_r, 'post'),
  put: handler(_r, 'put'),
  realRouter: _r,
});
