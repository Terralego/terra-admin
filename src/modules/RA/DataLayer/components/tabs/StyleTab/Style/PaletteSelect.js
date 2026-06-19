import React from 'react';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

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
}) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <RadioGroup row value={paletteType} onChange={onTypeChange}>
        <FormControlLabel value="sequential" control={<Radio size="small" />} label="Séquentielle" />
        <FormControlLabel value="diverging" control={<Radio size="small" />} label="Divergente" />
        <FormControlLabel value="custom" control={<Radio size="small" />} label="Personnalisée" />
      </RadioGroup>
      <FormControlLabel
        control={<Checkbox size="small" checked={reversed} onChange={onReverseToggle} />}
        label="Inverser"
      />
      <IconButton onClick={onCopyPalette} title="Copier la palette" size="small">
        <FileCopyIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={onPastePalette} title="Coller la palette" size="small">
        <NoteAddIcon fontSize="small" />
      </IconButton>
    </div>

    {paletteType !== 'custom' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
        <Select
          value={selectedPalette || ''}
          onChange={onPaletteSelect}
          displayEmpty
          style={{ minWidth: 160 }}
        >
          <MenuItem value="" disabled>Choisir une palette</MenuItem>
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

export default PaletteSelect;
