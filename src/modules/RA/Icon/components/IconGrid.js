import React from 'react';
import { useListContext, useTranslate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import transparency from './transparency-pattern.png';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gridGap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  card: {
    position: 'relative',
    cursor: 'pointer',
    transition: theme.transitions.create(['box-shadow', 'border-color']),
    border: '2px solid transparent',
  },
  selected: {
    borderColor: theme.palette.primary.main,
  },
  checkbox: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  // The whole point of this view: a large preview on a checkerboard, so
  // transparency and light-coloured icons stay readable
  preview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    backgroundImage: `url(${transparency})`,
    backgroundRepeat: 'repeat',
  },
  image: {
    maxWidth: '80%',
    maxHeight: '80%',
  },
  caption: {
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  name: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  empty: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
}));

/**
 * Grid of icon previews, to be used as the child of <List> in place of a
 * <Datagrid>.
 *
 * It reads the list context rather than props, so pagination, filters and the
 * bulk action toolbar keep working exactly as they do with a datagrid — the
 * selection here feeds the very same `selectedIds`.
 *
 * @param {Object} libraryIndex result of useFetchIconLibraryIndex, to resolve
 *   the library an icon comes from
 */
export const IconGrid = ({ libraryIndex }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { ids = [], data = {}, selectedIds = [], onToggleItem, loaded } = useListContext();

  const libraryName = React.useCallback(id => {
    if (!id || !libraryIndex || libraryIndex.status !== 'success') {
      return undefined;
    }
    const match = libraryIndex.data.find(item => item.id === id);
    return match ? match.name : id;
  }, [libraryIndex]);

  if (!loaded) {
    return (
      <div className={classes.empty}>
        <CircularProgress />
      </div>
    );
  }

  if (!ids.length) {
    return (
      <Typography className={classes.empty} color="textSecondary">
        {translate('ra.page.empty')}
      </Typography>
    );
  }

  return (
    <div className={classes.root}>
      {ids.map(id => {
        const record = data[id];
        if (!record) {
          return null;
        }
        const isSelected = selectedIds.includes(id);
        const library = libraryName(record.source);

        return (
          <Card
            key={id}
            className={`${classes.card} ${isSelected ? classes.selected : ''}`}
            onClick={() => onToggleItem(id)}
          >
            <Checkbox
              className={classes.checkbox}
              checked={isSelected}
              tabIndex={-1}
              inputProps={{ 'aria-label': record.name }}
            />
            <div className={classes.preview}>
              <img className={classes.image} src={record.file} alt={record.name} />
            </div>
            <div className={classes.caption}>
              <Typography variant="body2" className={classes.name} title={record.name}>
                {record.name}
              </Typography>
              <Typography variant="caption" color="textSecondary" className={classes.name}>
                {library || ' '}
              </Typography>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default IconGrid;
