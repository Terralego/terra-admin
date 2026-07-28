import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslate } from 'ra-core';
import React from 'react';
import { FixedSizeList } from 'react-window';
import ICONSET from '../../assets/icons/iconset.json';
import ICON_GROUPS from '../../assets/icons/iconset-groups.json';
import ColorPicker from './ColorPicker';

const LIST_HEIGHT = 400;
const ITEM_SIZE = 80;
const ICONS_COLUMNS = 5;
const BODY_HEIGHT = 510;
const SIDEBAR_WIDTH = 220;
const CUSTOMIZATION_WIDTH = 280;

const DIVIDER = 'rgba(0, 0, 0, 0.12)';
const PRIMARY = '#1976d2';

const DEFAULT_CUSTOMIZATION = {
  iconColor: '#000000',
  showBackground: false,
  backgroundColor: '#ffffff',
  backgroundBorderRadius: 0,
  iconScale: 1,
  showBorder: false,
  backgroundBorderWidth: 1,
  backgroundBorderColor: '#000000',
};

const CUSTOMIZATION_PRESETS = [
  {
    id: 'black-no-bg',
    label: 'Black icon, no background',
    value: { ...DEFAULT_CUSTOMIZATION, iconColor: '#000000' },
  },
  {
    id: 'white-no-bg',
    label: 'White icon, no background',
    value: { ...DEFAULT_CUSTOMIZATION, iconColor: '#ffffff' },
  },
  {
    id: 'white-blue-circle-white-border',
    label: 'White icon, blue circle, white border',
    value: {
      iconColor: '#ffffff',
      showBackground: true,
      backgroundColor: '#3621c2',
      backgroundBorderRadius: 100,
      iconScale: 0.7,
      showBorder: true,
      backgroundBorderWidth: 2,
      backgroundBorderColor: '#ffffff',
    },
  },
  {
    id: 'black-white-square-black-border',
    label: 'Black icon, white square, black border',
    value: {
      iconColor: '#000000',
      showBackground: true,
      backgroundColor: '#ffffff',
      backgroundBorderRadius: 15,
      iconScale: 0.7,
      showBorder: true,
      backgroundBorderWidth: 1,
      backgroundBorderColor: '#000000',
    },
  },
  {
    id: 'blue-white-circle',
    label: 'Blue icon, white circle',
    value: {
      iconColor: '#3621c2',
      showBackground: true,
      backgroundColor: '#ffffff',
      backgroundBorderRadius: 100,
      iconScale: 0.7,
      showBorder: false,
      backgroundBorderWidth: 1,
      backgroundBorderColor: '#000000',
    },
  },
];

const VBOX = 100;

export function IconSvg ({ item, customization = DEFAULT_CUSTOMIZATION, size = 40 }) {
  const clipIdRef = React.useRef(`svgclip-${Math.random().toString(36).slice(2)}`);

  if (!item?.pathData) {
    return null;
  }

  const { width, height, pathData, viewBox } = item;
  const [minX, minY, vbWidth, vbHeight] = viewBox ? viewBox.map(Number) : [0, 0, width, height];

  const fit = VBOX / Math.max(vbWidth, vbHeight);
  const offsetX = (VBOX - vbWidth * fit) / 2 - minX * fit;
  const offsetY = (VBOX - vbHeight * fit) / 2 - minY * fit;
  const half = VBOX / 2;
  const iconTransform =
    `translate(${half} ${half}) scale(${customization.iconScale}) translate(${-half} ${-half}) `
    + `translate(${offsetX} ${offsetY}) scale(${fit})`;

  const showRect = customization.showBackground;
  const bw = showRect && customization.showBorder ? customization.backgroundBorderWidth : 0;
  const radius = (customization.backgroundBorderRadius / 100) * half;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${VBOX} ${VBOX}`}>
      <defs>
        <clipPath id={clipIdRef.current}>
          <rect
            x={bw / 2}
            y={bw / 2}
            width={VBOX - bw}
            height={VBOX - bw}
            rx={radius}
            ry={radius}
          />
        </clipPath>
      </defs>
      {showRect && (
        <rect
          x={bw / 2}
          y={bw / 2}
          width={VBOX - bw}
          height={VBOX - bw}
          rx={radius}
          ry={radius}
          fill={customization.backgroundColor}
          stroke={customization.showBorder ? customization.backgroundBorderColor : 'none'}
          strokeWidth={bw}
        />
      )}
      <g clipPath={showRect ? `url(#${clipIdRef.current})` : undefined}>
        <g transform={iconTransform}>
          {pathData.map(path => (
            <path
              key={`${item.name}-${path.d.slice(0, 24)}`}
              d={path.d}
              fill={customization.iconColor}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

function IconPicker ({ onChange = () => {}, disabled, children, initialValue, ...props }) {
  const translate = useTranslate();
  const [showPicker, setShowPicker] = React.useState(false);

  const handleCancel = () => setShowPicker(false);

  const handleSelect = payload => {
    onChange(payload);
    setShowPicker(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          if (!disabled) {
            setShowPicker(true);
          }
        }}
        endIcon={<AppsIcon />}
        {...props}
      >
        {children}
      </Button>
      <Dialog open={showPicker} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>{translate('icon.form.file.iconPicker.dialog.title')}</DialogTitle>
        {showPicker && (
          <IconListContent
            onSelect={handleSelect}
            onCancel={handleCancel}
            initialValue={initialValue}
          />
        )}
      </Dialog>
    </>
  );
}

function normalizeSearchTerms (search) {
  return search
    .split(' ')
    .map(term => term.trim().toLowerCase())
    .filter(Boolean);
}

function matchesSearchTerms (value, searchTerms) {
  return searchTerms.every(term => value.toLowerCase().includes(term));
}

function previewBgStyle (previewMode) {
  const color = previewMode === 'dark' ? '#444' : '#ddd';
  return {
    backgroundImage: `
      linear-gradient(45deg, ${color} 25%, transparent 25%),
      linear-gradient(-45deg, ${color} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${color} 75%),
      linear-gradient(-45deg, transparent 75%, ${color} 75%)
    `,
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
    backgroundColor: previewMode === 'dark' ? '#222' : '#f5f5f5',
  };
}

function getAllIcons (iconset, groups) {
  return (iconset.iconGroups || []).flatMap(group =>
    Object.entries(group.svgs || {}).map(([fileName, icon]) => {
      const name = fileName.replace(/\.svg$/, '');
      return { name, ...icon, groups: groups[name]?.groups || [] };
    }));
}

const ALL_ICONS = getAllIcons(ICONSET, ICON_GROUPS);
const CATEGORIES = [...new Set(ALL_ICONS.flatMap(icon => icon.groups))].sort();

function buildIconRows (icons, search, selectedCategories) {
  const searchTerms = normalizeSearchTerms(search);
  const filtered = icons.filter(icon =>
    (selectedCategories.length === 0
      || selectedCategories.some(category => icon.groups.includes(category)))
    && (searchTerms.length === 0 || matchesSearchTerms(icon.name, searchTerms)));

  const rows = [];
  for (let index = 0; index < filtered.length; index += ICONS_COLUMNS) {
    rows.push({ icons: filtered.slice(index, index + ICONS_COLUMNS) });
  }
  return { rows, count: filtered.length };
}

function RowComponent ({ index, style, data }) {
  const { rows, onSelect, customization, previewMode, selectedName } = data;
  const row = rows[index];

  if (!row || row.spacer) {
    return <div style={style} />;
  }

  return (
    <div
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: `repeat(${ICONS_COLUMNS}, ${ITEM_SIZE - 4}px)`,
        justifyContent: 'start',
        alignContent: 'start',
        gap: 8,
        padding: '4px 12px 10px 12px',
      }}
    >
      {row.icons.map(item => (
        <Tooltip key={item.name} title={item.name}>
          <Box style={{ width: ITEM_SIZE - 4, height: ITEM_SIZE - 4 }}>
            <Card
              variant="outlined"
              style={{
                height: '100%',
                border: `${selectedName === item.name ? 2 : 1}px solid ${
                  selectedName === item.name ? PRIMARY : DIVIDER
                }`,
              }}
            >
              <CardActionArea style={{ height: '100%' }} onClick={() => onSelect(item)}>
                <CardContent
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2,
                    ...previewBgStyle(previewMode),
                  }}
                >
                  <IconSvg item={item} customization={customization} size={44} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Tooltip>
      ))}
    </div>
  );
}

function CategoriesList ({ categories, selectedCategories, onClick, onReset }) {
  const translate = useTranslate();
  return (
    <>
      <Box style={{ flex: 1, overflowY: 'auto' }}>
        <List disablePadding>
          {categories.map(category => (
            <ListItem
              key={category}
              button
              selected={selectedCategories.includes(category)}
              onClick={() => onClick(category)}
              disableGutters
              style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 8 }}
            >
              <Checkbox
                edge="start"
                checked={selectedCategories.includes(category)}
                size="small"
                tabIndex={-1}
                disableRipple
                style={{ padding: 4 }}
              />
              <ListItemText
                primary={category}
                primaryTypographyProps={{
                  variant: 'body2',
                  style: { textTransform: 'capitalize' },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box style={{ display: 'flex', alignItems: 'center', gap: 4, padding: 8, minHeight: 40 }}>
        <Typography variant="caption" color="textSecondary">
          {selectedCategories.length} {translate('icon.form.file.iconPicker.dialog.selected')}
        </Typography>
        {selectedCategories.length > 0 && (
          <IconButton
            onClick={onReset}
            color="primary"
            size="small"
            style={{ marginLeft: 'auto' }}
          >
            <BackspaceOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </>
  );
}

function CustomizationPanel ({ previewMode, setPreviewMode, customization, setCustomization }) {
  const update = patch => setCustomization({ ...customization, ...patch });
  return (
    <Box
      style={{
        width: CUSTOMIZATION_WIDTH,
        flexShrink: 0,
        borderLeft: `1px solid ${DIVIDER}`,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <ToggleButtonGroup
        value={previewMode}
        exclusive
        onChange={(e, newMode) => newMode !== null && setPreviewMode(newMode)}
        size="small"
        fullWidth
      >
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
      </ToggleButtonGroup>
      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {CUSTOMIZATION_PRESETS.map(p => (
          <Box
            key={p.id}
            title={p.label}
            onClick={() => setCustomization(p.value)}
            style={{
              cursor: 'pointer',
              border: `2px solid ${customization === p.value ? PRIMARY : 'transparent'}`,
              borderRadius: 6,
              padding: 2,
              lineHeight: 0,
              ...previewBgStyle(previewMode),
            }}
          >
            <svg width={32} height={32} viewBox="0 0 32 32">
              <rect
                x={p.value.showBorder ? p.value.backgroundBorderWidth / 2 : 0}
                y={p.value.showBorder ? p.value.backgroundBorderWidth / 2 : 0}
                width={p.value.showBorder ? 32 - p.value.backgroundBorderWidth : 32}
                height={p.value.showBorder ? 32 - p.value.backgroundBorderWidth : 32}
                rx={(p.value.backgroundBorderRadius / 100) * 16}
                ry={(p.value.backgroundBorderRadius / 100) * 16}
                fill={p.value.showBackground ? p.value.backgroundColor : 'none'}
                stroke={p.value.showBorder ? p.value.backgroundBorderColor : 'none'}
                strokeWidth={p.value.showBorder ? p.value.backgroundBorderWidth : 0}
              />
              <circle cx={16} cy={16} r={7 * p.value.iconScale} fill={p.value.iconColor} />
            </svg>
          </Box>
        ))}
      </Box>
      <Divider />
      <Box>
        <Typography variant="caption" display="block" gutterBottom>
          Icon Color
        </Typography>
        <ColorPicker
          value={customization.iconColor}
          onChange={color => update({ iconColor: color })}
          showInput
        />
      </Box>
      <Box>
        <Typography variant="caption" display="block" gutterBottom>
          Icon Scale: {customization.iconScale.toFixed(1)}x
        </Typography>
        <Slider
          value={customization.iconScale}
          onChange={(e, val) => update({ iconScale: val })}
          min={0.2}
          max={1}
          step={0.1}
          marks={[{ value: 0.2, label: '0.2' }, { value: 1, label: '1' }]}
          size="small"
        />
      </Box>
      <Divider />
      <FormControlLabel
        control={(
          <Switch
            checked={customization.showBackground}
            onChange={e => update({ showBackground: e.target.checked })}
            size="small"
          />
        )}
        label={<Typography variant="caption">Background</Typography>}
      />
      {customization.showBackground && (
        <>
          <Box>
            <Typography variant="caption" display="block" gutterBottom>
              Background Color
            </Typography>
            <ColorPicker
              value={customization.backgroundColor}
              onChange={color => update({ backgroundColor: color })}
              showInput
            />
          </Box>
          <Box>
            <Typography variant="caption" display="block" gutterBottom>
              Border Radius: {customization.backgroundBorderRadius}%
            </Typography>
            <Slider
              value={customization.backgroundBorderRadius}
              onChange={(e, val) => update({ backgroundBorderRadius: val })}
              min={0}
              max={100}
              marks={[{ value: 0, label: '0%' }, { value: 100, label: '100%' }]}
              size="small"
            />
          </Box>
          <FormControlLabel
            control={(
              <Switch
                checked={customization.showBorder}
                onChange={e => update({ showBorder: e.target.checked })}
                size="small"
              />
            )}
            label={<Typography variant="caption">Border</Typography>}
          />
          {customization.showBorder && (
            <>
              <Box>
                <Typography variant="caption" display="block" gutterBottom>
                  Border Width: {customization.backgroundBorderWidth}px
                </Typography>
                <Slider
                  value={customization.backgroundBorderWidth}
                  onChange={(e, val) => update({ backgroundBorderWidth: val })}
                  min={0}
                  max={5}
                  marks={[{ value: 0, label: '0' }, { value: 5, label: '5' }]}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="caption" display="block" gutterBottom>
                  Border Color
                </Typography>
                <ColorPicker
                  value={customization.backgroundBorderColor}
                  onChange={color => update({ backgroundBorderColor: color })}
                  showInput
                />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

function IconListContent ({ onSelect, onCancel, initialValue }) {
  const translate = useTranslate();

  const [search, setSearch] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [selectedIcon, setSelectedIcon] = React.useState(() =>
    (initialValue
      ? ALL_ICONS.find(icon => icon.name === initialValue.name)
        || { ...initialValue, groups: initialValue.groups || [] }
      : undefined));
  const [previewMode, setPreviewMode] = React.useState('light');
  const [customization, setCustomization] = React.useState(
    initialValue?.customization || DEFAULT_CUSTOMIZATION,
  );
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleCategory = category =>
    setSelectedCategories(current =>
      (current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category]));

  const { rows, count } = buildIconRows(ALL_ICONS, search, selectedCategories);
  const displayRows = selectedIcon ? [...rows, { spacer: true }, { spacer: true }] : rows;

  return (
    <>
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Box style={{ display: 'flex', height: BODY_HEIGHT, overflow: 'hidden' }}>
          {sidebarOpen && (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                width: SIDEBAR_WIDTH,
                borderRight: `1px solid ${DIVIDER}`,
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 48,
                  paddingLeft: 12,
                }}
              >
                <Typography variant="subtitle2">
                  {translate('icon.form.file.iconPicker.dialog.categories')}
                </Typography>
                <IconButton size="small" onClick={() => setSidebarOpen(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              <Divider />
              <CategoriesList
                categories={CATEGORIES}
                selectedCategories={selectedCategories}
                onClick={toggleCategory}
                onReset={() => setSelectedCategories([])}
              />
            </Box>
          )}

          <Box
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: 'hidden',
              padding: 16,
              gap: 8,
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!sidebarOpen && (
                <Tooltip title={translate('icon.form.file.iconPicker.dialog.categories')}>
                  <Badge badgeContent={selectedCategories.length} color="primary">
                    <IconButton size="small" onClick={() => setSidebarOpen(true)}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
              )}
              <TextField
                label={translate('form.search')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                style={{ flex: 1 }}
                size="small"
              />
            </Box>
            <Box style={{ position: 'relative', border: `1px solid ${DIVIDER}`, borderRadius: 4 }}>
              <FixedSizeList
                height={LIST_HEIGHT}
                width="100%"
                itemCount={displayRows.length}
                itemSize={ITEM_SIZE + 10}
                itemData={{
                  rows: displayRows,
                  onSelect: setSelectedIcon,
                  customization,
                  previewMode,
                  selectedName: selectedIcon?.name,
                }}
                itemKey={(index, data) => {
                  const row = data.rows[index];
                  if (!row || row.spacer) {
                    return `spacer-${index}`;
                  }
                  return `row-${row.icons.map(item => item.name).join('-')}`;
                }}
              >
                {RowComponent}
              </FixedSizeList>
              {selectedIcon && (
                <Card
                  elevation={6}
                  style={{
                    position: 'absolute',
                    left: 8,
                    right: 8,
                    bottom: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                  }}
                >
                  <Box
                    style={{
                      width: 56,
                      height: 56,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                      ...previewBgStyle(previewMode),
                    }}
                  >
                    <IconSvg item={selectedIcon} customization={customization} size={44} />
                  </Box>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {selectedIcon.name}
                    </Typography>
                    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                      {selectedIcon.groups.map(group => (
                        <Chip
                          key={group}
                          label={group}
                          size="small"
                          style={{ textTransform: 'capitalize' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => setSelectedIcon(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Card>
              )}
            </Box>
            <Typography variant="caption" color="textSecondary">
              {count} {translate('icon.form.file.iconPicker.dialog.icons')}
            </Typography>
          </Box>

          <CustomizationPanel
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            customization={customization}
            setCustomization={setCustomization}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {translate('icon.form.file.iconPicker.dialog.cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedIcon}
          onClick={() => selectedIcon && onSelect({
            name: selectedIcon.name,
            pathData: selectedIcon.pathData,
            viewBox: selectedIcon.viewBox,
            width: selectedIcon.width,
            height: selectedIcon.height,
            customization,
          })}
        >
          {translate('ra.action.confirm')}
        </Button>
      </DialogActions>
    </>
  );
}

export default IconPicker;
