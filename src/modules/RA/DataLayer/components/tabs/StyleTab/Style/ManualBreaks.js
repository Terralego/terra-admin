import React from 'react';
import MuiTextField from '@mui/material/TextField';

export const roundTo = (n, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
};

const CLAMP_MARGIN = 0.01;

const ManualBreaks = ({ boundaries, setBoundaries }) => {
  const [localDraft, setLocalDraft] = React.useState(null);

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
      {boundaries.slice(1, -1).map((b, i) => {
        const realValue = Number(boundaries[i + 1]);
        const displayValue = localDraft?.[i + 1] ?? realValue;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            <MuiTextField
              type="number"
              value={roundTo(displayValue)}
              onChange={e => {
                const raw = e.target.value;
                const num = parseFloat(raw);
                if (raw === '' || Number.isNaN(num)) return;
                const next = localDraft ? [...localDraft] : [...boundaries];
                const prev = Number(next[i + 1]);
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
                  setLocalDraft(next);
                  return;
                }
                next[i + 1] = roundTo(num);
                setLocalDraft(next);
              }}
              onFocus={() => {
                if (!localDraft) setLocalDraft([...boundaries]);
              }}
              onBlur={e => {
                const raw = parseFloat(e.target.value);
                if (Number.isNaN(raw)) {
                  setLocalDraft(null);
                  return;
                }
                const minVal = Number(boundaries[i]);
                const maxVal = Number(boundaries[i + 2]);
                if (raw < minVal + CLAMP_MARGIN || raw > maxVal - CLAMP_MARGIN) {
                  setLocalDraft(null);
                  return;
                }
                const next = [...boundaries];
                next[i + 1] = roundTo(raw);
                setBoundaries(next);
                setLocalDraft(null);
              }}
              onKeyDown={e => {
                if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
                e.preventDefault();
                const next = localDraft ? [...localDraft] : [...boundaries];
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
                setLocalDraft(next);
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
        );
      })}
      <span>{roundTo(Number(boundaries[boundaries.length - 1]))}</span>
    </div>
  );
};

export default ManualBreaks;
