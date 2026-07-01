import React from 'react';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { useTranslate } from 'react-admin';

import styles from './styles';

const useStyles = makeStyles(styles);

const PaletteSelect = ({
  paletteType,
  palettes,
  selectedPalette,
  reversed,
  onTypeChange,
  onPaletteSelect,
  onReverseToggle,
  onCopyPalette,
  onPastePalette,
}) => {
  const translate = useTranslate();
  const classes = useStyles();
  const isInterpolated = selectedPalette && !palettes.some(p => p.name === selectedPalette);

  return (
    <>
      <div className={classes.paletteRow}>
        <RadioGroup className="palette-type" row value={paletteType} onChange={onTypeChange}>
          <FormControlLabel value="sequential" control={<Radio size="small" color="primary" />} label={translate('style-editor.palette.sequential')} />
          <FormControlLabel value="diverging" control={<Radio size="small" color="primary" />} label={translate('style-editor.palette.diverging')} />
          <FormControlLabel value="custom" control={<Radio size="small" color="primary" />} label={translate('style-editor.palette.custom')} />
        </RadioGroup>
        <FormControlLabel
          control={<Checkbox size="small" color="primary" checked={reversed} onChange={onReverseToggle} />}
          label={translate('style-editor.palette.reverse')}
        />
        <Tooltip title={translate('style-editor.palette.copy-format')} placement="top">
          <IconButton onClick={onCopyPalette} size="small">
            <FileCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={translate('style-editor.palette.paste-format')} placement="top">
          <IconButton onClick={onPastePalette} size="small">
            <NoteAddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {paletteType !== 'custom' && (
        <div className={classes.paletteSelectRow}>
          <Select
            value={selectedPalette || ''}
            onChange={onPaletteSelect}
            displayEmpty
            style={{ minWidth: 160 }}
            renderValue={v => {
              if (!v) return translate('style-editor.palette.choose');
              const p = palettes.find(pal => pal.name === v);
              if (!p) {
                return `${v}${isInterpolated ? ` ${translate('style-editor.palette.interpolated')}` : ''}`;
              }
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', height: 16, width: 64, borderRadius: 2, overflow: 'hidden', border: '1px solid #ccc' }}>
                    {p.colors.map(c => (
                      <div key={c} style={{ flex: 1, backgroundColor: c }} />
                    ))}
                  </div>
                  <span>{p.name}</span>
                </div>
              );
            }}
          >
            <MenuItem value="" disabled>{translate('style-editor.palette.choose')}</MenuItem>
            {palettes.map(p => (
              <MenuItem key={p.id} value={p.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', height: 16, width: 64, borderRadius: 2, overflow: 'hidden', border: '1px solid #ccc' }}>
                    {p.colors.map((c, i) => (
                      <div key={`${p.id}-${i + 1}`} style={{ flex: 1, backgroundColor: c }} />
                    ))}
                  </div>
                  <span>{p.name}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
    </>
  );
};

export default PaletteSelect;
