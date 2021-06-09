import React, { useState } from 'react';
import Immutable from 'immutable';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '../helper';
import { SumOfOneTimeRange } from '../sagas';

export default function CustomBarChart() {
  const timeRange = useAppSelector((state) => state.get('timeRange')) as string;
  const data = useAppSelector((state) => (
    state.getIn(['data', timeRange], undefined)
  ));
  const selecteds: any = useAppSelector((state) => (
    state.get('selecteds', Immutable.List())
  ));

  const [casesActive, setCaseActive] = useState(true);
  const [deathsActive, setDeathsActive] = useState(true);
  const [recoveredActive, setRecoveredActive] = useState(true);

  if (!data) {
    return null;
  }

  const showFullName = (
    !!(selecteds.size < 7 && selecteds.size !== 0)
  );

  const dataInJS: SumOfOneTimeRange[] = (
    !selecteds || selecteds.size === 0
      ? data.toJS()
      : data.filter((item: any) => selecteds.includes(item.get('id'))).toJS()
  );

  const handleClickOnLegend = (event: any) => {
    switch (event.dataKey) {
      case 'cases': {
        setCaseActive(!casesActive);
        break;
      }
      case 'deaths': {
        setDeathsActive(!deathsActive);
        break;
      }
      case 'recovered': {
        setRecoveredActive(!recoveredActive);
        break;
      }
      default: {
        break;
      }
    }
  };

  const payload: any[] = [
    {
      color: '#8884d8',
      dataKey: 'cases',
      inactive: !casesActive,
      type: 'rect',
      value: 'cases',
    },
    {
      color: 'red',
      dataKey: 'deaths',
      inactive: !deathsActive,
      type: 'rect',
      value: 'deaths',
    },
    {
      color: '#82ca9d',
      dataKey: 'recovered',
      inactive: !recoveredActive,
      type: 'rect',
      value: 'recovered',
    },
  ];

  const labelFormatter = (label: string) => {
    const tmp = dataInJS.find((item) => item.region === label);
    return tmp ? tmp.name : null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={dataInJS}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={showFullName ? 'name' : 'region'} />
        <YAxis />
        {showFullName ? (
          <Tooltip />
        ) : (
          <Tooltip labelFormatter={labelFormatter} />
        )}
        <Legend onClick={handleClickOnLegend} payload={payload} />
        {casesActive ? <Bar dataKey="cases" fill="#8884d8" /> : null}
        {deathsActive ? <Bar dataKey="deaths" fill="red" /> : null}
        {recoveredActive ? <Bar dataKey="recovered" fill="#82ca9d" /> : null}
      </BarChart>
    </ResponsiveContainer>
  );
}
