import React from 'react';

import { useTranslate } from 'react-admin';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import ExtentIcon from './ExtentIcon';
import ExtentMap from './ExtentMap';
import { getCategory, isValidBbox } from './utils';

const Action = ({ title, disabled, onClick, children }) => (
  <Tooltip title={title}>
    {}
    <span>
      <IconButton size="small" disabled={disabled} onClick={onClick}>
        {children}
      </IconButton>
    </span>
  </Tooltip>
);

const ExtentPreview = ({ extent, id, index, count, onMove, onDelete }) => {
  const translate = useTranslate();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box display="flex" alignItems="center" minWidth={0} style={{ gap: '.5em' }}>
          <ExtentIcon extent={extent} size={32} />
          <Box minWidth={0}>
            <Typography variant="subtitle2" noWrap>
              {extent ? extent.name : translate('view.form.extent.unknown', { id })}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap component="p">
              {[
                index === 0 ? translate('view.form.extent.main') : `#${index + 1}`,
                getCategory(extent),
              ].filter(Boolean).join(' · ')}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexShrink={0}>
          <Action
            title={translate('view.form.extent.move-up')}
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
          >
            <ArrowUpwardIcon fontSize="small" />
          </Action>
          <Action
            title={translate('view.form.extent.move-down')}
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
          >
            <ArrowDownwardIcon fontSize="small" />
          </Action>
          <Action title={translate('view.form.extent.delete')} onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </Action>
        </Box>
      </Box>

      <ExtentMap readOnly bbox={extent?.bbox} />

      <Typography variant="caption" color="textSecondary" component="p">
        {isValidBbox(extent?.bbox)
          ? extent.bbox.map(coord => coord.toFixed(4)).join(', ')
          : translate('view.form.extent.no-area')}
      </Typography>
    </Box>
  );
};

export default ExtentPreview;
