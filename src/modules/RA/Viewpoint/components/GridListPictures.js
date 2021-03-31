import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { translate, useListContext } from 'react-admin';

import MuiGridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import IconContentAdd from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import { linkToRecord } from 'ra-core'; // eslint-disable-line import/no-extraneous-dependencies

import compose from '../../../../utils/compose';
import { RES_PICTURE } from '../../ra-modules';

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

const GridList = ({
  // translate: t,
  classes,
  ids,
  data,
  width,
  location,
  viewpointId,
}) => {
  const {
    basePath,
  } = useListContext();

  return (
    <div className={classes.root}>
      <MuiGridList
        cellHeight={180}
        cols={getColsForWidth(width)}
        className={classes.gridList}
      >
        {ids.map(id => {
          const {
            file,
            owner: { properties: ownerProperties = {} } = {},
            // state,
            id: pictId,
            identifier,
          } = data[id] || {};
          return (
            <GridListTile
              component={Link}
              key={id}
              to={{
                pathname: linkToRecord(basePath, pictId),
                state: {
                  redirect: location.pathname,
                },
              }}
            >
              {file && <img src={file.list} alt={identifier} />}
              <GridListTileBar
                className={classes.tileBar}
                title={identifier}
                subtitle={(
                  <span>
                    {ownerProperties.name}
                    {/* &nbsp;|&nbsp;
                  {t('resources.picture.fields.properties.state')}&nbsp;:{' '}
                  {state} */}
                  </span>
              )}
                actionIcon={(
                  <IconButton>
                    <EditIcon color="secondary" />
                  </IconButton>
              )}
              />
            </GridListTile>
          );
        })}

        <GridListTile
          component={Link}
          key="add"
          to={{
            pathname: `/${RES_PICTURE}/create`,
            state: {
              record: { viewpoint: viewpointId },
              redirect: location.pathname,
            },
          }}
        >
          <IconButton>
            <IconContentAdd />
          </IconButton>
        </GridListTile>
      </MuiGridList>
    </div>
  );
};

export default compose(
  translate,
  withRouter,
  withWidth(),
  withStyles(styles),
)(GridList);
