import React from 'react';
import Immutable from 'immutable';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppSelector, useAppDispatch } from '../helper';
import { setSelecteds } from '../actions';
import { SumOfOneTimeRange } from '../sagas';

const COLORS = [
  '#2196f3',
  '#e91e63',
  '#ff9800',
  '#673ab7',
  '#3f51b5',
  '#ffeb3b',
  '#f44336',
  '#ffc107',
  '#009688',
  '#9c27b0',
  '#8bc34a',
  '#cddc39',
  '#00bcd4',
  '#ff5722',
  '#03a9f4',
  '#4caf50',
];

const getSumsOfSelecteds = (data: SumOfOneTimeRange[]) => (
  data.reduce(
    (acc, curr) => ({
      cases: acc.cases + curr.cases,
      deaths: acc.deaths + curr.deaths,
      recovered: acc.recovered + curr.recovered,
    }),
    {
      cases: 0,
      deaths: 0,
      recovered: 0,
    },
  ));

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CustomPieChart() {
  const dispatch = useAppDispatch();
  const timeRange = useAppSelector((state) => state.get('timeRange')) as string;
  const data = useAppSelector((state) => (
    state.getIn(['data', timeRange], undefined)
  ));
  const selecteds = useAppSelector((state) => (
    state.get('selecteds', Immutable.List())
  )) as any;

  const sums = useAppSelector((state) => (
    state.getIn(['sum', timeRange], undefined)
  ));

  if (!data) {
    return null;
  }

  const dataInJS: SumOfOneTimeRange[] = !selecteds || selecteds.size === 0
    ? data.toJS()
    : data.filter((item: any) => selecteds.includes(item.get('id'))).toJS();

  if (selecteds.size !== 0) {
    const currSums = getSumsOfSelecteds(dataInJS);
    dataInJS.unshift({
      id: 20,
      name: 'others',
      region: 'other',
      cases: sums.get('cases') - currSums.cases,
      deaths: sums.get('deaths') - currSums.deaths,
      recovered: sums.get('recovered') - currSums.recovered,
    });
  }

  const payload: any[] = dataInJS.map((item, index) => ({
    color: COLORS[index],
    inactive: false,
    type: 'rect',
    value: item.name,
    id: item.id,
    tooltip: 'click to remove',
  }));

  const handleClickOnLegend = (event: any) => {
    if (event.id === 20) {
      return;
    }
    if (selecteds.size === 0) {
      const tmp = Array.from(Array(16).keys());
      tmp.splice(event.id, 1);
      dispatch(setSelecteds(Immutable.List(tmp)));
    } else {
      dispatch(setSelecteds(selecteds.delete(selecteds.indexOf(event.id))));
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <text x="5%" y="6%" fill="#8884d8">
          Cases:
        </text>
        <Pie
          data={dataInJS}
          cx="20%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="cases"
          label={renderCustomizedLabel}
        >
          {dataInJS.map((entry, index) => (
            <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text x="35%" y="6%" fill="red">
          Deaths:
        </text>
        <Pie
          data={dataInJS}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="deaths"
          label={renderCustomizedLabel}
        >
          {dataInJS.map((entry, index) => (
            <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text x="65%" y="6%" fill="#82ca9d">
          Recovered:
        </text>
        <Pie
          data={dataInJS}
          cx="80%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="recovered"
          label={renderCustomizedLabel}
        >
          {dataInJS.map((entry, index) => (
            <Cell key={`cell-${entry.id}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend payload={payload} onClick={handleClickOnLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
}
