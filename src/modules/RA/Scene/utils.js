import { getFlatDataFromTree } from 'react-sortable-tree';

import { RES_DATALAYER } from '../ra-modules';

/**
 * Return an array of layer ids in given treeData
 */
export const getLayerIdsFromTree = (treeData = []) => {
  const flatNodes = getFlatDataFromTree({
    treeData,
    ignoreCollapsed: false,
    getNodeKey: ({ treeIndex }) => treeIndex,
  });

  return Array.from(flatNodes.reduce(
    (set, { node: { geolayer } = {} }) => set.add(geolayer),
    new Set(),
  )).filter(Boolean);
};

export const fetchLayerNames = async (dataProvider, ids) => {
  const { data } = await dataProvider.getMany(RES_DATALAYER, { ids });

  return data.reduce((names, { id, name }) => ({ ...names, [id]: name }), {});
};

export const withoutRedundantLabels = (treeData = [], layerNames = {}) =>
  treeData.map(({ children, ...node }) => {
    const nextChildren = children
      ? { children: withoutRedundantLabels(children, layerNames) }
      : {};

    if (!node.group && node.label === layerNames[node.geolayer]) {
      const { label, ...withoutLabel } = node;
      return { ...withoutLabel, ...nextChildren };
    }

    return { ...node, ...nextChildren };
  });

export default {
  getLayerIdsFromTree,
  fetchLayerNames,
  withoutRedundantLabels,
};
