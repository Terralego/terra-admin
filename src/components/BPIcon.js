import React from 'react';
import { Icon } from '@blueprintjs/core';

export const widgetIcons = [
  'add',
  'add-column-left',
  'add-column-right',
  'add-row-bottom',
  'add-row-top',
  'alignment-bottom',
  'alignment-horizontal-center',
  'alignment-left',
  'alignment-right',
  'alignment-top',
  'alignment-vertical-center',
  'equals',
  'greater-than',
  'greater-than-or-equal-to',
  'less-than',
  'less-than-or-equal-to',
  'not-equal-to',
];

export const graphIcons = [
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

const BPIcon = ({ icon, displayIconName, style = {}, ...rest }) =>
  (displayIconName ? (
    <>
      <Icon icon={icon} style={{ marginRight: '1em', ...style }} {...rest} /> {icon}
    </>
  ) : (
    <Icon icon={icon} style={style} {...rest} />
  ));

export default BPIcon;
