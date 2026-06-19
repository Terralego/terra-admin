import React from 'react';

const ClassifBornes = ({ breaksData }) => {
  if (breaksData.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: '4px 0',
        minWidth: 160,
        paddingLeft: 12,
      }}
    >
      {breaksData.map((d, i) => (
        <div
          key={`${d.x1}-${d.x2}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8em',
            fontFamily: 'monospace',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: d.color,
              flexShrink: 0,
            }}
          />
          <span>
            {'['}
            {typeof d.x1 === 'number' ? d.x1.toLocaleString() : d.x1}
            {' - '}
            {typeof d.x2 === 'number' ? d.x2.toLocaleString() : d.x2}
            {i === breaksData.length - 1 ? ']' : '['}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ClassifBornes;
