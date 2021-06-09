import React from 'react';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { setTimeRange } from '../actions';
import { useAppSelector, useAppDispatch } from '../helper';

const useStyles = makeStyles(() => ({
  sliderContainer: {
    display: 'flex',
  },
  slider: {
    marginLeft: 'auto',
    marginRight: '5%',
    width: '60%',
  },
}));

export default function TimeRangeSlider() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const timeRange = useAppSelector((state) => state.get('timeRange'));

  const handleChange = (event: any, newValue: number | number[]) => {
    if ((newValue !== 4) && typeof newValue === 'number') {
      dispatch(setTimeRange(`week_${4 - newValue}`));
    }
  };

  return (
    <div className={classes.sliderContainer}>
      <Slider
        className={classes.slider}
        track="inverted"
        value={
          (typeof timeRange === 'string') ? (
            4 - parseInt(timeRange.split('_')[1], 10)) : 3
        }
        max={4}
        min={0}
        marks={[
          { value: 0, label: '4 weeks' },
          { value: 1, label: '3 weeks' },
          { value: 2, label: '2 weeks' },
          { value: 3, label: '1 week' },
          { value: 4, label: 'Now' },
        ]}
        onChange={handleChange}
      />
    </div>
  );
}
