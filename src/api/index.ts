import { RouterWS } from 'src/util/wsHelper';
import exampleWS from './example';

const routerWS = RouterWS();

routerWS.use('example', exampleWS);

export default routerWS;
