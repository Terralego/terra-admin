import React from 'react';
import MuiTextField from '@mui/material/TextField';

export const roundTo = (n, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
};

const CLAMP_MARGIN = 0.01;

const ManualBreaks = ({ boundaries, setBoundaries }) => {
  const prevValRef = React.useRef({});

  return (
    <div
      className="manual-breaks"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 25,
      }}
    >
      <span>{roundTo(Number(boundaries[0]))}</span>
      <span style={{ margin: '0 4px' }}>-</span>
      {boundaries.slice(1, -1).map((b, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          <MuiTextField
            type="number"
            value={roundTo(Number(b))}
            onChange={e => {
              const raw = e.target.value;
              const next = [...boundaries];
              const prev = Number(next[i + 1]);
              const num = parseFloat(raw);
              if (raw === '' || Number.isNaN(num)) {
                return;
              }
              if (Math.abs(Math.abs(num - prev) - 1) < 0.001) {
                const minVal = Number(boundaries[i]);
                const maxVal = Number(boundaries[i + 2]);
                const diff = num - prev;
                const adjusted = diff > 0
                  ? Math.floor(prev) + 1
                  : Math.ceil(prev) - 1;
                let clamped = Math.min(
                  Math.max(adjusted, minVal + CLAMP_MARGIN),
                  maxVal - CLAMP_MARGIN,
                );
                if (roundTo(clamped) === roundTo(prev) && clamped < maxVal - CLAMP_MARGIN) {
                  clamped = Math.min(
                    Math.max(num, minVal + CLAMP_MARGIN),
                    maxVal - CLAMP_MARGIN,
                  );
                }
                next[i + 1] = roundTo(clamped);
                setBoundaries(next);
                return;
              }
              next[i + 1] = roundTo(num);
              setBoundaries(next);
            }}
            onFocus={() => { prevValRef.current[i] = boundaries[i + 1]; }}
            onBlur={e => {
              const raw = parseFloat(e.target.value);
              if (Number.isNaN(raw)) return;
              const minVal = Number(boundaries[i]);
              const maxVal = Number(boundaries[i + 2]);
              if (raw < minVal + CLAMP_MARGIN || raw > maxVal - CLAMP_MARGIN) {
                const next = [...boundaries];
                next[i + 1] = prevValRef.current[i];
                setBoundaries(next);
                return;
              }
              const next = [...boundaries];
              next[i + 1] = roundTo(raw);
              setBoundaries(next);
            }}
            onKeyDown={e => {
              if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
              e.preventDefault();
              const next = [...boundaries];
              const prev = Number(next[i + 1]);
              const minVal = Number(boundaries[i]);
              const maxVal = Number(boundaries[i + 2]);
              const increment = e.key === 'ArrowUp' ? 1 : -1;
              const adjusted = increment > 0
                ? Math.floor(prev) + 1
                : Math.ceil(prev) - 1;
              let clamped = Math.min(
                Math.max(adjusted, minVal + CLAMP_MARGIN),
                maxVal - CLAMP_MARGIN,
              );
              if (roundTo(clamped) === roundTo(prev) && clamped < maxVal - CLAMP_MARGIN) {
                clamped = Math.min(
                  Math.max(prev + increment, minVal + CLAMP_MARGIN),
                  maxVal - CLAMP_MARGIN,
                );
              }
              next[i + 1] = roundTo(clamped);
              setBoundaries(next);
            }}
            inputProps={{
              style: { textAlign: 'center' },
              step: 'any',
            }}
            variant="outlined"
            size="small"
            sx={{ width: 110 }}
          />
          <span style={{ margin: '0 4px' }}>-</span>
        </React.Fragment>
      ))}
      <span>{roundTo(Number(boundaries[boundaries.length - 1]))}</span>
    </div>
  );
};

export default ManualBreaks;
