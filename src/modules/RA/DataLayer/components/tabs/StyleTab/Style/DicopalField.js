import React, { useState, useRef, useMemo, useEffect } from 'react';
import { getPalettes, getSequentialColors, getAsymmetricDivergingColors } from 'dicopal';

import { makeStyles } from '@material-ui/core/styles';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
} from '@material-ui/core';

import ColorListField from './ColorListField';

import styles from './styles';

const useStyles = makeStyles(styles);

const DicopalField = ({ value = [], onChange = () => {}, maxClasses = 10 }) => {
  const classes = useStyles();
  const applyingRef = useRef(false);

  const [paletteType, setPaletteType] = useState('custom');
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [reversed, setReversed] = useState(false);

  const palettes = useMemo(
    () => getPalettes({ type: paletteType, number: value.length || 5 }),
    [paletteType, value.length],
  );

  useEffect(() => {
    applyingRef.current = false;
  }, [value]);

  const interpolate = (name, count, rev) => {
    if (!name) return;
    applyingRef.current = true;
    try {
      let colors;
      if (paletteType === 'diverging') {
        const half = Math.floor(count / 2);
        const central = count % 2 === 1;
        colors = getAsymmetricDivergingColors(name, half, half, central, false, rev);
      } else {
        colors = getSequentialColors(name, count, rev);
      }
      onChange(colors);
    } catch (e) {
      // y'a des palettes avec pas assez de couleur donc on ignore
    }
  };

  const handleTypeChange = e => {
    const newType = e.target.value;
    setPaletteType(newType);
    setSelectedPalette(null);
  };

  const handlePaletteSelect = e => {
    const name = e.target.value;
    setSelectedPalette(name);
    interpolate(name, value.length, reversed);
  };

  const handleReverse = () => {
    const newReversed = !reversed;
    setReversed(newReversed);
    if (selectedPalette && paletteType !== 'custom') {
      interpolate(selectedPalette, value.length, newReversed);
    }
  };

  const handleColorListChange = newValue => {
    if (applyingRef.current) {
      applyingRef.current = false;
      onChange(newValue);
      return;
    }
    if (newValue.length !== value.length) {
      if (selectedPalette && paletteType !== 'custom') {
        interpolate(selectedPalette, newValue.length, reversed);
        return;
      }
    } else {
      setPaletteType('custom');
      setSelectedPalette(null);
    }
    onChange(newValue);
  };

  const paletteTypeOptions = [
    { id: 'sequential', name: 'Séquentielle' },
    { id: 'diverging', name: 'Divergente' },
    { id: 'custom', name: 'Personnalisée' },
  ];

  return (
    <div className={classes.styleField}>
      <RadioGroup
        row
        value={paletteType}
        onChange={handleTypeChange}
      >
        {paletteTypeOptions.map(opt => (
          <FormControlLabel
            key={opt.id}
            value={opt.id}
            control={<Radio size="small" />}
            label={opt.name}
          />
        ))}
      </RadioGroup>

      {paletteType !== 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <Select
            value={selectedPalette || ''}
            onChange={handlePaletteSelect}
            displayEmpty
            style={{ minWidth: 160 }}
          >
            <MenuItem value="" disabled>
              Choisir une palette
            </MenuItem>
            {palettes.map(p => (
              <MenuItem key={p.id} value={p.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      height: 16,
                      width: 64,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #ccc',
                    }}
                  >
                    {p.colors.map((c, i) => (
                      <div
                        key={`${p.id}-${i + 1}`}
                        style={{ flex: 1, backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span>{p.name}</span>
                </div>
              </MenuItem>
            ))}
          </Select>

          <FormControlLabel
            control={(
              <Checkbox
                size="small"
                checked={reversed}
                onChange={handleReverse}
              />
            )}
            label="Inverser"
          />
        </div>
      )}

      <ColorListField
        value={value}
        onChange={handleColorListChange}
        maxClasses={maxClasses}
      />
    </div>
  );
};

export default DicopalField;
