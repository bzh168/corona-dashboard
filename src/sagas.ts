import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import ACTIONS, { FETCH_DATA_URL } from './constants';
import { getData } from './helper';

// index can be cases, deaths or recovered
interface Item {
  [index: string]: number;
}

interface Region {
  id: number;
  name: string;
  history: Array<Item>;
}

// index can be BB, BE, BW ...
interface ResponseData {
  [index: string]: Region;
}

interface ResponseMeta {
  contact: string;
  info: string;
  lastCheckedForUpdate: string;
  lastUpdate: string;
  source: string;
}

interface Response {
  data: ResponseData;
  meta: ResponseMeta;
}

interface DataGroupByWeek {
  week_4: number;
  week_3: number;
  week_2: number;
  week_1: number;
}

interface ArrangedCases {
  cases: DataGroupByWeek;
  id: number;
  name: string;
  region: string;
}

interface ArrangedData {
  cases: DataGroupByWeek;
  deaths: DataGroupByWeek;
  recovered: DataGroupByWeek;
  id: number;
  name: string;
  region: string;
}

export interface SumOfOneTimeRange {
  id: number;
  name: string;
  region: string;
  cases: number;
  deaths: number;
  recovered: number;
}

// index can be week_1, week_2, week_3 or week_4
interface Sums {
  [index: string]: SumOfOneTimeRange[];
}

type WeekProperty = 'week_1' | 'week_2' | 'week_3' | 'week_4';
type ItemProperty = 'cases' | 'deaths' | 'recovered';

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName];
}

function sumDataOfFourTimeRanges(data: number[]): DataGroupByWeek {
  return (
    {
      week_4: data.reduce((acc, curr) => acc + curr),
      week_3: data.slice(7).reduce((acc, curr) => acc + curr),
      week_2: data.slice(14).reduce((acc, curr) => acc + curr),
      week_1: data.slice(21).reduce((acc, curr) => acc + curr),
    }
  );
}

function arrangeCases(response: Response) {
  return Object.entries(response.data).map((item: [string, Region]) => ({
    cases: sumDataOfFourTimeRanges(
      item[1].history.map((itemInner) => itemInner.cases),
    ),
    id: item[1].id - 1,
    name: item[1].name,
    region: item[0],
  }));
}

function arrangeDeaths(response: Response) {
  return Object.entries(response.data).map((item: [string, Region]) => ({
    deaths: sumDataOfFourTimeRanges(
      item[1].history.map((itemInner) => itemInner.deaths),
    ),
    id: item[1].id - 1,
    name: item[1].name,
    region: item[0],
  }));
}

function arrangeRecovered(response: Response) {
  return Object.entries(response.data).map((item: [string, Region]) => ({
    recovered: sumDataOfFourTimeRanges(
      item[1].history.map((itemInner) => itemInner.recovered),
    ),
    id: item[1].id - 1,
    name: item[1].name,
    region: item[0],
  }));
}

const groupDataByTimeRange = (data: ArrangedData[], timeRange: WeekProperty) => (
  data.map((item) => ({
    id: item.id,
    region: item.region,
    name: item.name,
    cases: getProperty(item.cases, timeRange),
    deaths: getProperty(item.deaths, timeRange),
    recovered: getProperty(item.recovered, timeRange),
  })));

const summerizeByProperty = (array: SumOfOneTimeRange[], property: ItemProperty) => (
  array.map(
    (item: SumOfOneTimeRange) => getProperty(item, property),
  ).reduce((acc, curr) => acc + curr)
);

const summerize = (data: Sums, timeRange: WeekProperty) => ({
  cases: summerizeByProperty(getProperty(data, timeRange), 'cases'),
  deaths: summerizeByProperty(getProperty(data, timeRange), 'deaths'),
  recovered: summerizeByProperty(getProperty(data, timeRange), 'recovered'),
});

function* getArrangedData() {
  const originalCases: Response = yield call(
    getData,
    FETCH_DATA_URL.replace('pattern', 'cases/28'),
  );
  const cases = arrangeCases(originalCases);
  const deaths = arrangeDeaths(
    yield call(getData, FETCH_DATA_URL.replace('pattern', 'deaths/28')),
  );
  const recovered = arrangeRecovered(
    yield call(getData, FETCH_DATA_URL.replace('pattern', 'recovered/28')),
  );
  const tmpData = cases.map(
    (value: ArrangedCases, index: number) => (
      { ...value, ...deaths[index], ...recovered[index] }
    ),
  );

  return [
    {
      week_1: groupDataByTimeRange(tmpData, 'week_1'),
      week_2: groupDataByTimeRange(tmpData, 'week_2'),
      week_3: groupDataByTimeRange(tmpData, 'week_3'),
      week_4: groupDataByTimeRange(tmpData, 'week_4'),
    },
    originalCases.meta,
  ];
}

export function* sagasFetchData() {
  const [data, meta] : [Sums, ResponseMeta] = yield call(getArrangedData);
  yield put({
    type: ACTIONS.GOT_DATA,
    payload: { data },
  });
  yield put({
    type: ACTIONS.GOT_META,
    payload: { meta },
  });

  const sum = {
    week_1: summerize(data, 'week_1'),
    week_2: summerize(data, 'week_2'),
    week_3: summerize(data, 'week_3'),
    week_4: summerize(data, 'week_4'),
  };

  yield put({
    type: ACTIONS.SET_SUM,
    payload: { sum },
  });
  yield put({
    type: ACTIONS.FETCH_EVERY_HOUR,
  });
}

export function* fetchEveryHour() {
  yield delay(3600000);
  const probe: Response = yield call(
    getData,
    FETCH_DATA_URL.replace('pattern', 'cases/1'),
  );
  const lastUpdate: string = yield select((state) => (
    state.getIn(['meta', 'lastUpdate'])
  ));
  if (probe.meta.lastUpdate !== lastUpdate) {
    yield call(sagasFetchData);
  }
  yield put({
    type: ACTIONS.FETCH_EVERY_HOUR,
  });
}

export default function* watcher() {
  yield takeEvery(ACTIONS.FETCH_DATA, sagasFetchData);
  yield takeLatest(ACTIONS.FETCH_EVERY_HOUR, fetchEveryHour);
}
