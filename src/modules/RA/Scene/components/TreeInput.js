import React from 'react';

import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

import { addField, Labeled } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
/* eslint-enable */

const treeInputStyle = {
  minWidth: '35em',
  minHeight: 400,
};

/**
 * Determine if node can have children or not
 * Currently, return true only if node have `group === true` property
 *
 * @param {Object} node
 * @param {Object} node.group [group=true] Wether current node is a group or not
 * @returns {boolean} Wether node can have children or not
 */
const canNodeHaveChildren = ({ group = false }) => group;

const generateNodeProps = ({ node, path }) => ({
  title: (
    <div>
      {node.group ? 'Groupe : ' : 'Calque : '} {node.title}
    </div>
  ),
  subtitle: <div>{JSON.stringify(path)}</div>,
  style: {
    border: '1px solid',
    borderColor: node.group ? 'green' : 'transparent',
  },
});

const TreeInput = ({ input: { value, onChange }, source, ...props }) => {
  const addGroup = () => onChange([
    ...value,
    { title: 'New group name', group: true },
  ]);

  const addLayer = () => onChange([
    ...value,
    { title: 'New layer name' },
  ]);

  return (
    <Labeled label={source} {...props}>
      <>
        <div style={treeInputStyle}>
          <SortableTree
            treeData={value}
            onChange={onChange}
            canNodeHaveChildren={canNodeHaveChildren}
            generateNodeProps={generateNodeProps}
            style={{ flex: '1 1 100%', minHeight: 400 }}
          />

          <div>
            <Button onClick={addGroup}>Add group</Button>
            <Button onClick={addLayer}>Add layer</Button>
          </div>
        </div>
      </>
    </Labeled>
  );
};

export default addField(TreeInput);
