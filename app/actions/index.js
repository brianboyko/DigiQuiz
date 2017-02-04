import * as counterActions from './counterActions';
import { push } from 'react-router-redux';

export default Object.assign({}, counterActions, { push });
