import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import GraphChart from '../../../../../../../../components/GraphChart';
import getChartData from '../chartData';

/** A Chart block: a graph of fields of the object, as the front shows it. */
export const ChartBlock = ({ block: { label, graph, series }, properties }) => {
  const translate = useTranslate();
  const data = getChartData(series, properties);

  return (
    <Box>
      {label && <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>{label}</Typography>}
      {data.length
        ? <GraphChart graph={graph} data={data} />
        : (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ textAlign: 'center' }}>
            {translate('datalayer.form.minisheet.chart.no-data')}
          </Typography>
        )}
    </Box>
  );
};

export default ChartBlock;
