import React from 'react';
import { SelectInput, TextInput } from 'react-admin';

import { Icon } from '@blueprintjs/core';

const bpIcons = [
  'chart',
  'curved-range-chart',
  'database',
  'diagram-tree',
  'doughnut-chart',
  'flow-branch',
  'flow-end',
  'flow-linear',
  'flow-review',
  'flow-review-branch',
  'flows',
  'form',
  'full-stacked-chart',
  'gantt-chart',
  'graph',
  'grid',
  'grouped-bar-chart',
  'heat-grid',
  'heatmap',
  'horizontal-bar-chart',
  'horizontal-bar-chart-asc',
  'horizontal-bar-chart-desc',
  'layout',
  'layout-auto',
  'layout-balloon',
  'layout-circle',
  'layout-grid',
  'layout-group-by',
  'layout-hierarchy',
  'layout-linear',
  'layout-skew-grid',
  'layout-sorted-clusters',
  'many-to-many',
  'many-to-one',
  'one-to-many',
  'one-to-one',
  'pie-chart',
  'polygon-filter',
  'regression-chart',
  'scatter-plot',
  'series-add',
  'series-configuration',
  'series-derived',
  'series-filtered',
  'series-search',
  'stacked-chart',
  'step-chart',
  'timeline-area-chart',
  'timeline-bar-chart',
  'timeline-line-chart',
  'trending-down',
  'trending-up',
  'vertical-bar-chart-asc',
  'vertical-bar-chart-desc',
  'waterfall-chart',
].sort();

const EmbedItemInput = ({ source }) => {
  const iconChoices = React.useMemo(
    () => bpIcons.map(bpIcon => ({
      id: bpIcon,
      name: <><Icon icon={bpIcon} style={{ marginRight: '1em' }} /> {bpIcon}</>,
    })),
    [],
  );

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1em' }}>
      <SelectInput
        source={`${source}.icon`}
        label="datalayer.form.embed.icon"
        choices={iconChoices}
        translateChoice={false}
        helperText={false}
      />

      <TextInput
        label="datalayer.form.embed.title"
        source={`${source}.title`}
        type="text"
        helperText="datalayer.form.embed.title-help"
      />

      <TextInput
        label="datalayer.form.embed.src"
        source={`${source}.src`}
        type="url"
        placeholder="https://myiframe.page"
        helperText="datalayer.form.embed.src-help"
      />
    </div>
  );
};

export default EmbedItemInput;
