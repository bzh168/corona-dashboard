import Immutable from 'immutable';
import ACTIONS from './constants';

export function fetchData() {
  return {
    type: ACTIONS.FETCH_DATA,
  };
}

export function setSelecteds(ids: Immutable.List<number>) {
  return {
    type: ACTIONS.SET_SELECTEDS,
    payload: {
      selecteds: ids,
    },
  };
}

export function setTimeRange(timeRange: string) {
  return {
    type: ACTIONS.SET_TIME_Range,
    payload: {
      timeRange,
    },
  };
}
