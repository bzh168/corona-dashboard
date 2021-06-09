import React, { useEffect } from 'react';
import Immutable from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { useAppSelector, useAppDispatch } from '../helper';
import { fetchData, setSelecteds } from '../actions';
import { SumOfOneTimeRange } from '../sagas';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 1;
}

type Order = 'asc' | 'desc';

function getComparator<T>(
  order: Order,
  orderBy: keyof T,
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  return array.sort((a, b) => comparator(a, b));
}

interface HeadCell {
  id: keyof SumOfOneTimeRange;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}

const headCells: HeadCell[] = [
  {
    id: 'name', numeric: false, disablePadding: true, label: 'Region',
  },
  {
    id: 'cases', numeric: true, disablePadding: false, label: 'Cases',
  },
  {
    id: 'deaths', numeric: true, disablePadding: false, label: 'Deaths',
  },
  {
    id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered',
  },
];

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  th: {
    'padding-left': 0,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function TableComponent() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof SumOfOneTimeRange>('region');
  const timeRange = useAppSelector((state) => state.get('timeRange')) as string;
  const data = useAppSelector((state) => (
    state.getIn(['data', timeRange], undefined)
  ));
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  const selecteds: any = useAppSelector((state) => (
    state.get('selecteds', Immutable.List())
  ));

  if (!data) {
    return null;
  }

  const rows: SumOfOneTimeRange[] = data.toJS();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof SumOfOneTimeRange,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (selecteds.size !== rows.length && selecteds.size !== 0) {
        dispatch(setSelecteds(Immutable.List()));
        return;
      }
      dispatch(setSelecteds(Immutable.List(rows.map((i) => i.id))));
    } else {
      dispatch(setSelecteds(Immutable.List()));
    }
  };

  const handleClick = (event: React.MouseEvent<unknown>, rowId: number) => {
    const newSelecteds = selecteds.includes(rowId)
      ? selecteds.delete(selecteds.indexOf(rowId))
      : selecteds.push(rowId);
    dispatch(setSelecteds(newSelecteds));
  };

  return (
    <Grid container className={classes.root} spacing={1} direction="column">
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          aria-label="enhanced table"
          size="small"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell className={classes.th}>
                <Checkbox
                  indeterminate={
                    selecteds.size > 0 && selecteds.size < rows.length
                  }
                  checked={rows.length > 0 && selecteds.size === rows.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                  size="small"
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  className={classes.th}
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc'
                          ? 'sorted descending'
                          : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => {
              const isItemSelected = selecteds.includes(row.id);
              const labelId = `enhanced-table-checkbox-${row.id}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                >
                  <TableCell className={classes.th}>
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.cases}</TableCell>
                  <TableCell align="right">{row.deaths}</TableCell>
                  <TableCell align="right">{row.recovered}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
