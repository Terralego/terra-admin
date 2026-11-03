import React from 'react';
import { useInput } from 'ra-core';

import GraphChart from '../../../../../../../components/GraphChart';

export const GRAPH_WIDTH = 280;

const SAMPLE_DATA = [
  { label: 'Data 1', value: 5.120 },
  { label: 'Data 2', value: 50.45621 },
  { label: 'Data 3', value: 10.4896546 },
  { label: 'Data 4', value: 63 }];

function WidgetGraphPreview ({ source }) {
  const {
    input: { value: type },
  } = useInput({ source: `${source}.graph.type` });
  const {
    input: { value: orientation },
  } = useInput({ source: `${source}.graph.orientation` });
  const {
    input: { value: decimals },
  } = useInput({ source: `${source}.graph.decimals` });
  const {
    input: { value: percent },
  } = useInput({ source: `${source}.graph.percent` });
  const {
    input: { value: unit },
  } = useInput({ source: `${source}.graph.unit` });

  const graph = React.useMemo(() => ({
    type,
    orientation,
    decimals: decimals === '' ? 0 : decimals,
    percent,
    unit,
  }), [type, orientation, decimals, percent, unit]);

  if (!type) {
    return null;
  }

  return (
    <div style={{ width: GRAPH_WIDTH, height: GRAPH_WIDTH }}>
      <GraphChart graph={graph} data={SAMPLE_DATA} width={GRAPH_WIDTH} />
    </div>
  );
}

export default WidgetGraphPreview;
