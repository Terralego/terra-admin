import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

/* eslint-disable import/no-extraneous-dependencies */
import InsertFieldIcon from '@material-ui/icons/PostAdd';
/* eslint-enable */

const I18N = 'datalayer.form.minisheet.style';

export const COLORS = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'custom'];

/** A select whose options are translated under `prefix`, with an optional empty choice. */
export const SelectField = ({ label, value, options, prefix, onChange, empty, ...props }) => {
  const translate = useTranslate();

  return (
    <TextField
      select
      size="small"
      fullWidth
      label={translate(label)}
      value={value ?? ''}
      onChange={event => onChange(event.target.value || undefined)}
      {...props}
    >
      {empty && <MenuItem value="">{translate(empty)}</MenuItem>}
      {options.map(option => (
        <MenuItem key={option} value={option}>{translate(`${prefix}.${option}`)}</MenuItem>
      ))}
    </TextField>
  );
};

const Swatch = ({ color }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      width: 14,
      height: 14,
      mr: 1,
      flexShrink: 0,
      borderRadius: '50%',
      border: 1,
      borderColor: 'divider',
      verticalAlign: 'middle',
      bgcolor: color ?? 'transparent',
    }}
  />
);

/**
 * A row of buttons for a setting with few values, each an icon or a short
 * text with its name in a tooltip. With `deselect`, clicking the chosen value
 * again goes back to the default one (undefined).
 */
export const ToggleSetting = ({ label, value, options, prefix, onChange, deselect = false }) => {
  const translate = useTranslate();

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div">{translate(label)}</Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value ?? null}
        onChange={(event, next) => {
          if (next !== null || deselect) {
            onChange(next ?? undefined);
          }
        }}
      >
        {options.map(({ value: option, icon: Icon, text }) => (
          <Tooltip key={option} title={translate(`${prefix}.${option}`)}>
            <ToggleButton value={option} aria-label={translate(`${prefix}.${option}`)} sx={{ minWidth: 40 }}>
              {Icon ? <Icon fontSize="small" /> : <Box component="span" sx={{ textTransform: 'none', fontWeight: 600 }}>{text}</Box>}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

/** `color` from the theme palette, or `custom` with its `customColor`. */
export const ColorSettings = ({ block, onChange }) => {
  const translate = useTranslate();
  const theme = useTheme();
  const swatch = color => (color === 'custom' ? block.customColor : `${color}.main`);
  const label = color => (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
      {color && <Swatch color={swatch(color)} />}
      {translate(`${I18N}.colors.${color || 'default'}`)}
    </Box>
  );

  return (
    <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
      <TextField
        select
        size="small"
        fullWidth
        label={translate(`${I18N}.color`)}
        value={block.color ?? ''}
        slotProps={{ select: { displayEmpty: true, renderValue: label }, inputLabel: { shrink: true } }}
        onChange={({ target: { value } }) => onChange({
          color: value || undefined,
          ...(value === 'custom' && !block.customColor && { customColor: theme.palette.primary.main }),
        })}
      >
        <MenuItem value="">{label('')}</MenuItem>
        {COLORS.map(color => <MenuItem key={color} value={color}>{label(color)}</MenuItem>)}
      </TextField>
      {block.color === 'custom' && (
        <TextField
          size="small"
          type="color"
          sx={{ width: 96, flexShrink: 0 }}
          label={translate(`${I18N}.custom-color`)}
          value={block.customColor || theme.palette.primary.main}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={event => onChange({ customColor: event.target.value })}
        />
      )}
    </Stack>
  );
};

/** `icon`: an emoji or a link to an image, before or after the text. */
export const IconSettings = ({ icon, onChange }) => {
  const translate = useTranslate();
  const change = update => {
    const next = { position: 'start', ...icon, ...update };
    onChange(next.value ? next : undefined);
  };

  return (
    <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
      <TextField
        size="small"
        fullWidth
        label={translate(`${I18N}.icon`)}
        value={icon?.value ?? ''}
        onChange={event => change({ value: event.target.value })}
      />
      <SelectField
        label={`${I18N}.icon-position`}
        value={icon?.position ?? 'start'}
        options={['start', 'end']}
        prefix={`${I18N}.icon-positions`}
        disabled={!icon?.value}
        sx={{ width: 160, flexShrink: 0 }}
        onChange={position => change({ position })}
      />
    </Stack>
  );
};

const NONE = [];

const TURN_VARIABLES = ['$value', '$formatted_value', '$icon', '$label', '$field'];

/**
 * A text where `{{field}}` stands for the value of a field of the object,
 * with a menu inserting a field at the cursor. Inside a Repeat block, the
 * menu starts with the value, label and name of the field of the turn.
 */
export const InterpolatedTextField = ({ label, value, onChange, context: { fields = NONE, ancestors = NONE }, ...props }) => {
  const translate = useTranslate();
  const inputRef = React.useRef();
  const [anchor, setAnchor] = React.useState(null);
  const text = value ?? '';

  const insert = name => {
    setAnchor(null);
    const { selectionStart = text.length, selectionEnd = text.length } = inputRef.current ?? {};
    onChange(`${text.slice(0, selectionStart)}{{${name}}}${text.slice(selectionEnd)}`);
  };

  const turnItems = ancestors.includes('repeat')
    ? [
      ...TURN_VARIABLES.map(name => (
        <MenuItem key={name} onClick={() => insert(name)}>
          {translate(`datalayer.form.minisheet.repeat.variables.${name.slice(1)}`)}
        </MenuItem>
      )),
      <Divider key="divider" />,
    ]
    : [];

  return (
    <>
      <TextField
        size="small"
        fullWidth
        label={translate(label)}
        value={text}
        inputRef={inputRef}
        onChange={event => onChange(event.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={translate(`${I18N}.insert-field`)}>
                  <IconButton size="small" edge="end" onClick={event => setAnchor(event.currentTarget)}>
                    <InsertFieldIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        {...props}
      />
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {[
          ...turnItems,
          ...fields.filter(({ name }) => name).map(({ sourceFieldId, name, label: fieldLabel }) => (
            <MenuItem key={sourceFieldId ?? name} onClick={() => insert(name)}>{fieldLabel || name}</MenuItem>
          )),
        ]}
      </Menu>
    </>
  );
};
