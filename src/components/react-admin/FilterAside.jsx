import React from 'react';
import { FilterLiveSearch } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      order: -1, // ListView renders `main` as a flex row, aside last
      flex: '0 0 19em',
      marginRight: '1em',
      height: 'fit-content',
    },
    // Below sm the list falls back to the Filter Button/Form combo
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  search: {
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Shell of a FilterList sidebar, to be passed as the `aside` of a <List>.
 *
 * Holds the geometry shared by every list using this pattern, so they cannot
 * drift apart. Pass `search` to get a live search field on top.
 *
 * @param {string} [search] source of the live search filter
 */
export const FilterAside = ({ search, children }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        {!!search && (
          <div className={classes.search}>
            <FilterLiveSearch source={search} />
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default FilterAside;
