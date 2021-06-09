import { AnyAction } from 'redux';
import Immutable from 'immutable';
import ACTIONS from './constants';

export default function reducer(state = Immutable.Map(), action: AnyAction) {
  switch (action.type) {
    case ACTIONS.GOT_DATA: {
      return state.set('data', Immutable.fromJS(action.payload.data));
    }
    case ACTIONS.GOT_META: {
      return state.set('meta', Immutable.fromJS(action.payload.meta));
    }
    case ACTIONS.SET_SELECTEDS: {
      return state.set('selecteds', action.payload.selecteds);
    }
    case ACTIONS.SET_TIME_Range: {
      return state.set('timeRange', action.payload.timeRange);
    }
    case ACTIONS.SET_SUM: {
      return state.set('sum', Immutable.fromJS(action.payload.sum));
    }
    default: {
      return state;
    }
  }
}
