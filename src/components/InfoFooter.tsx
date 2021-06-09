import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../helper';

export default function InfoFooter() {
  const timeRange = useAppSelector((state) => state.get('timeRange')) as string;
  const sums = useAppSelector((state) => (
    state.getIn(['sum', timeRange], undefined)
  ));
  const timeStamp = useAppSelector((state) => state.getIn(['meta', 'lastUpdate']));

  const timeRangeLabel = useMemo(() => {
    if (timeRange) {
      return timeRange === 'week_1'
        ? 'In last week'
        : `In past ${timeRange.slice(-1)} weeks`;
    }
    return null;
  }, [timeRange]);

  const timeStampLable = useMemo(() => new Date(timeStamp), [timeStamp]);

  if (!sums) {
    return null;
  }

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <span>
        {timeRangeLabel}
        , there are
        {' '}
      </span>
      <span>
        {sums.get('cases')}
        {' '}
        cases,
        {' '}
      </span>
      <span>
        {sums.get('deaths')}
        {' '}
        deaths,
        {' '}
      </span>
      <span>
        {sums.get('recovered')}
        {' '}
        recovereds in Germany.
        {' '}
      </span>
      <br />
      <span>
        Updated:
        {timeStampLable.toString()}
      </span>
    </Typography>
  );
}
