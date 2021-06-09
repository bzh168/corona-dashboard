const ACTIONS = {
  FETCH_DATA: 'FETCH_DATA',
  GOT_DATA: 'GOT_DATA',
  GOT_META: 'GOT_META',
  SET_SELECTEDS: 'SET_SELECTEDS',
  SET_TIME_Range: 'SET_TIME_Range',
  SET_SUM: 'SET_SUM',
  FETCH_EVERY_HOUR: 'FETCH_EVERY_HOUR',
};

export const FETCH_DATA_URL = (
  'https://api.corona-zahlen.org/states/history/pattern'
);

export default ACTIONS;
