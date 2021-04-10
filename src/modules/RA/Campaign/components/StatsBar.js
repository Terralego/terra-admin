import React from 'react';

import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  bar: {
    backgroundColor: '#d9e6f4',
    width: '100%',
    padding: '1em',
    marginBottom: '2em',
    borderRadius: '5px',
    color: '#7d7c7c',
    display: 'flex',
    alignItems: 'center',
    '& span': {
      marginRight: '5em',
      verticalAlign: 'center',
      '& em': {
        fontSize: '1.5em',
        fontWeight: 'bold',
        margin: '0 0.5em',
        fontStyle: 'normal',
      },
    },
  },
});

const AddViewpoint = ({ record: { statistics } }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <div className={classes.bar}>
      <span>
        <em>{statistics.total}</em> {translate('resources.campaign.fields.viewpoints')}
      </span>
      <span>
        <em>{statistics.submited}</em> {translate('resources.campaign.fields.statistics.submited')}
      </span>
      <span>
        <em>{statistics.accepted}</em> {translate('resources.campaign.fields.statistics.accepted')}
      </span>
      <span>
        {translate('resources.campaign.fields.statistics.progress')}{' '}
        <em>{Math.round((statistics.accepted / statistics.total) * 100)}%</em>
      </span>
    </div>
  );
};

export default AddViewpoint;
