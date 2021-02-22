import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { linkToRecord } from 'ra-core';
/* eslint-enable */

import compose from '../../utils/compose';

const styles = theme => ({
  root: {
    margin: '-2px',
  },
  gridList: {
    width: '100%',
    margin: 0,
  },
  tileBar: {
    background:
            'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)',
  },
  placeholder: {
    backgroundColor: theme.palette.grey[300],
    height: '100%',
  },
  price: {
    display: 'inline',
    fontSize: '1em',
  },
  link: {
    color: '#fff',
  },
});

const getColsForWidth = width => {
  if (width === 'xs') return 2;
  if (width === 'sm') return 3;
  if (width === 'md') return 4;
  if (width === 'lg') return 5;
  return 6;
};

const viewpointSubtitle = index => (
  Number.isNaN(Number(index))
    ? ['resources.viewpoint.viewpoint-no-number']
    : ['resources.viewpoint.viewpoint-number', { number: index }]
);

const GridList = ({ translate: t, classes, ids, data, basePath, width }) => (
  <div className={classes.root}>
    <MuiGridList cellHeight={180} cols={getColsForWidth(width)} className={classes.gridList}>
      {ids.map(id => (
        <GridListTile component={Link} key={id} to={linkToRecord(basePath, data[id].id)}>
          {data[id].picture && <img src={data[id].picture.list} alt={data[id].label} />}
          <GridListTileBar
            className={classes.tileBar}
            title={data[id].label}
            subtitle={data[id].properties && (
              <span>{t(...viewpointSubtitle(data[id].identifier))}</span>
            )}
          />
        </GridListTile>
      ))}
    </MuiGridList>
  </div>
);

export default compose(
  translate,
  withWidth(),
  withStyles(styles),
)(GridList);
