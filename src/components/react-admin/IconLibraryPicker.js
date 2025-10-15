import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import AppsIcon from '@material-ui/icons/Apps';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Alert } from '@material-ui/lab';
import { FixedSizeGrid } from 'react-window';
import { useTranslate } from 'ra-core';
import SearchIcon from '@material-ui/icons/Search';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useFetchIconLibraryIndex, { ICONS_ROOT } from '../../hooks/useFetchIconLibraryIndex';

const LIST_HEIGHT = 400;
const ITEM_SIZE = 128;
const ICONS_COLUMNS = 4;

function IconLibraryPicker ({
  onChange = () => {},
  disabled,
  ...props
}) {
  const translate = useTranslate();
  const [showPicker, setShowPicker] = React.useState(false);
  const [selectedLibrary, setSelectedLibrary] = React.useState();

  const libraryIndex = useFetchIconLibraryIndex(showPicker);

  const library = libraryIndex.data && libraryIndex.data.length === 1
    ? libraryIndex.data[0] : selectedLibrary;

  const content =  library ?
    (
      <IconListContent
        selectedLibrary={library}
        onBack={
          libraryIndex.data && libraryIndex.data.length > 1
            ? () => setSelectedLibrary(undefined) : undefined
        }
        onChange={v => {
          setShowPicker(false);
          onChange(v);
        }}
      />
    ) : (
      <IconLibraryContent
        libraryIndex={libraryIndex}
        onSelectLibrary={value => setSelectedLibrary(value)}
      />
    );

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
      />
      <Dialog open={showPicker} onClose={() => setShowPicker(false)} maxWidth="md">
        <DialogTitle>{translate('icon.form.file.library.dialog.title')}</DialogTitle>
        {content}
        <DialogActions>
          <Button onClick={() => setShowPicker(false)} color="primary">
            {translate('icon.form.file.library.dialog.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function IconLibraryContent ({ libraryIndex, onSelectLibrary }) {
  const translate = useTranslate();

  if (libraryIndex.status === 'idle') {
    return null;
  }
  if (libraryIndex.status === 'loading') {
    return <DialogContent style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></DialogContent>;
  }
  if (libraryIndex.status === 'error') {
    return <DialogContent><Alert severity="error">{translate('icon.form.file.library.dialog.error')}</Alert></DialogContent>;
  }

  return (
    <List>
      {libraryIndex.data.map(item => (
        <ListItem key={item.id} button onClick={() => onSelectLibrary(item)}>
          <ListItemIcon>
            <ChevronRightIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  );
}

async function convertImageToBase64 (imageUrl) {
  const response = await fetch(imageUrl);

  if (response.status < 200 || response.status >= 300) {
    throw Error(`Could not fetch image '${imageUrl}': error code ${response.status}`);
  }

  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function RowComponent ({
  columnIndex,
  rowIndex,
  style,
  data,
}) {
  const { selectedLibrary, iconsIndex, onChange, onError } = data;
  const index = rowIndex * ICONS_COLUMNS + columnIndex;
  const item = iconsIndex[index];
  if (!item) {
    return null;
  }

  const imageUrl = `${ICONS_ROOT}/${selectedLibrary.id}/${item.name}.png`;
  return (
    <Box
      style={{ ...style, width: ITEM_SIZE, height: ITEM_SIZE, padding: 4 }}
      key={item.name}
    >
      <Card style={{ height: '100%' }}>
        <CardActionArea
          style={{ height: '100%' }}
          onClick={async () => {
            try {
              const result = await convertImageToBase64(imageUrl);
              onChange({ value: result, name: item.name, source: selectedLibrary.id });
            } catch (e) {
              onError(e);
            }
          }}
        >
          <CardContent style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            paddingLeft: 5,
            paddingRight: 5,
          }}
          >
            <Box style={{ height: 50 }}>
              <Avatar style={{ height: 50, width: 50 }} src={imageUrl} variant="square" />
            </Box>
            <Typography variant="caption" style={{ textAlign: 'center', flex: 1 }}>{item.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

function isStringMatchingSearchTerms (str, searchTerms) {
  return searchTerms.every(term => str.includes(term));
}

function getFilteredData (data, search, selectedCategories) {
  const searchTerms = search.split(' ');
  return data.filter(
    item =>
      (
        selectedCategories.length === 0
        || selectedCategories.some(s => item.tags.some(t => t === s))
      )
    && (
      isStringMatchingSearchTerms(item.name, searchTerms)
      || item.aliases.some(alias => isStringMatchingSearchTerms(alias, searchTerms))
      || item.tags.some(tag => isStringMatchingSearchTerms(tag, searchTerms))
    ),
  );
}

function CategoriesList ({ categories, selectedCategories, onClick, onReset }) {
  const translate = useTranslate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', height: 48 }}>
        <Typography>{ translate('icon.form.file.library.dialog.categories')}</Typography>
      </Box>
      <Box sx={{ height: LIST_HEIGHT, overflow: 'auto' }}>
        <List>
          {categories.map(c => (
            <ListItem
              key={c}
              button
              selected={selectedCategories.includes(c)}
              onClick={() => onClick(c)}
            >
              <Checkbox
                checked={selectedCategories.includes(c)}
              />
              <ListItemText>{c}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', height: 48 }}>
        <Typography variant="caption">{selectedCategories.length} {translate('icon.form.file.library.dialog.selected')}</Typography>
        {selectedCategories.length > 0 ? (
          <IconButton onClick={onReset} color="primary">
            <BackspaceOutlinedIcon />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
}

function IconListContent ({ selectedLibrary, onBack, onChange }) {
  const translate = useTranslate();

  const [iconsIndex, setIconsIndex] = React.useState({ status: 'idle' });
  const [search, setSearch] = React.useState('');
  const [error, setError] = React.useState();
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  useEffect(() => {
    setIconsIndex({
      status: 'loading',
    });
    fetch(`${ICONS_ROOT}/${selectedLibrary.id}/icons.json`)
      .then(r => r.json())
      .then(result => setIconsIndex({ status: 'success', data: result }))
      .catch(() => setIconsIndex({ status: 'error' }));
  }, [selectedLibrary]);

  let content = null;
  if (iconsIndex.status === 'loading') {
    content = <DialogContent style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></DialogContent>;
  } else if (iconsIndex.status === 'error') {
    content = <DialogContent><Alert severity="error">An error occured</Alert></DialogContent>;
  } else if (iconsIndex.status === 'success') {
    const filteredData = getFilteredData(iconsIndex.data, search, selectedCategories);
    const categories = [...new Set(iconsIndex.data.map(item => item.tags).flat().sort())];
    content = (
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
          <CategoriesList
            categories={categories}
            selectedCategories={selectedCategories}
            onClick={c => {
              const newSelectedCategories = [...selectedCategories];
              if (newSelectedCategories.includes(c)) {
                newSelectedCategories.splice(newSelectedCategories.indexOf(c), 1);
              } else {
                newSelectedCategories.push(c);
              }
              setSelectedCategories(newSelectedCategories);
            }}
            onReset={() => setSelectedCategories([])}
          />
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            />
            <FixedSizeGrid
              height={LIST_HEIGHT}
              width={ITEM_SIZE * ICONS_COLUMNS}
              columnCount={ICONS_COLUMNS}
              rowCount={filteredData.length / ICONS_COLUMNS}
              rowHeight={ITEM_SIZE}
              columnWidth={ITEM_SIZE}
              itemData={{
                selectedLibrary,
                iconsIndex: filteredData,
                onChange,
                onError: setError,
              }}
              itemKey={({ columnIndex, rowIndex, data }) => {
                const index = rowIndex * ICONS_COLUMNS + columnIndex;
                const item = data.iconsIndex[index];
                return item?.name;
              }}
            >
              {RowComponent}
            </FixedSizeGrid>
            <Box style={{ display: 'flex', alignItems: 'center', height: 48 }}>
              <Typography variant="caption">{filteredData.length} {translate('icon.form.file.library.dialog.icons')}</Typography>
            </Box>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              open={error !== undefined}
              autoHideDuration={6000}
              onClose={() => setError(undefined)}
            >
              <Alert
                onClose={() => setError(undefined)}
                severity="error"
              >
                {translate('icon.form.file.library.dialog.errorImage')}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </DialogContent>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 24 }}>
        {onBack ? (
          <IconButton onClick={onBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
        ) : null}
        <Typography component="h3" variant="h6">{selectedLibrary.name}</Typography>
      </Box>
      <Divider />
      {content}
    </Box>
  );
}


export default IconLibraryPicker;
