import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableComponent from '../components/TableComponent';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import InfoFooter from '../components/InfoFooter';
import TimeRangeSlider from '../components/TimeRangeSlider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 400,
  },
  fixedHeight2: {
    height: 750,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper1 = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight2);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Typography component="h1" variant="h6" color="inherit" noWrap>
          Corona-Dashboard
        </Typography>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={5} lg={5}>
              <Paper>
                <TimeRangeSlider />
              </Paper>
              <Paper className={fixedHeightPaper2}>
                <TableComponent />
              </Paper>
            </Grid>
            <Grid item xs={12} md={7} lg={7}>
              <Paper className={fixedHeightPaper1}>
                <BarChart />
              </Paper>
              <Paper className={fixedHeightPaper1}>
                <PieChart />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={2}>
            <InfoFooter />
          </Box>
        </Container>
      </main>
    </div>
  );
}
