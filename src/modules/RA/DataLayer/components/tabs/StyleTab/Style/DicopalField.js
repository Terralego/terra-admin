/*
 * dicopal (Apache-2.0) - palette interpolation
 * (c) Matthieu Viry / CNRS
 * https://github.com/mthh/dicopal
 *
 * Palettes incluses via dicopal :
 *   ColorBrewer - Cynthia Brewer, Penn State (colorbrewer2.org)
 *   CARTOColors - CARTO (carto.com/carto-colors) - CC BY 4.0
 *   Scientific Colour Maps - Fabio Crameri (fabiocrameri.ch/colourmaps)
 *   cmocean - Kristen M. Thyng (matplotlib.org/cmocean)
 *   Color Universal Design - Masataka Okabe & Kei Ito
 *   Voir : https://github.com/mthh/dicopal
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { getPalettes, getSequentialColors, getAsymmetricDivergingColors } from 'dicopal';

import { makeStyles } from '@material-ui/core/styles';

import ColorListField, { DEFAULT_MAX_CLASSES } from './ColorListField';

import styles from './styles';
import PaletteSelect from './PaletteSelect';

const useStyles = makeStyles(styles);

const DicopalField = ({
  value = [], onChange = () => {}, maxClasses = DEFAULT_MAX_CLASSES,
  showAddRemove = true,
}) => {
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

  const prevCountRef = useRef(value.length);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = value.length;
    if (prev === 0 || prev === value.length || value.length === 0) return;
    if (selectedPalette && paletteType !== 'custom') {
      interpolate(selectedPalette, value.length, reversed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.length]);

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
    } else if (paletteType === 'custom') {
      onChange([...value].reverse());
    }
  };

  const parsePalette = text => {
    if (!text) return [];
    try {
      const parsed = JSON.parse(text.replace(/'/g, '"'));
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.filter(c => /^#[0-9a-fA-F]{6}$/.test(String(c).trim()));
      }
    } catch { /* not JSON */ }
    return [];
  };

  const handlePastePalette = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const colors = parsePalette(text);
      if (colors.length) {
        setPaletteType('custom');
        setSelectedPalette(null);
        onChange(colors);
      }
    } catch { /* clipboard non disponible */ }
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

  return (
    <div className={classes.styleField}>
      <PaletteSelect
        paletteType={paletteType}
        palettes={palettes}
        selectedPalette={selectedPalette}
        reversed={reversed}
        onTypeChange={handleTypeChange}
        onPaletteSelect={handlePaletteSelect}
        onReverseToggle={handleReverse}
        onCopyPalette={() => navigator.clipboard.writeText(`['${value.join("','")}']`)}
        onPastePalette={handlePastePalette}
      />

      <ColorListField
        value={value}
        onChange={handleColorListChange}
        maxClasses={maxClasses}
        showAddRemove={showAddRemove}
      />
    </div>
  );
};

export default DicopalField;
