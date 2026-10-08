import React from 'react';
import { useField } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  LinearProgress,
  TableContainer,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MapIcon from '@material-ui/icons/Map';
import { Alert, Skeleton } from '@material-ui/lab';
import getBboxPolygon from '@turf/bbox-polygon';

import useMaplibreMap from '../../../../components/Map/useMaplibreMap';

const useStyles = makeStyles(theme => ({
  meta: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1),
  },
  metaItem: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    '& strong': {
      color: theme.palette.text.primary,
    },
  },
  previewBody: {
    height: 469,
    overflow: 'auto',
  },
  oldContent: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
  map: {
    height:       220,
    width:        '100%',
    borderRadius: 4,
    marginTop:    theme.spacing(1),
  },
  mapPlaceholder: {
    height: 220,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    borderRadius: 4,
    border: `1px dashed ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
  },
  table: {
    minWidth: 650,
    borderCollapse: 'collapse',
    '& th, & td': {
      padding: theme.spacing(0.5, 1),
      borderBottom: `1px solid ${theme.palette.divider}`,
      textAlign: 'left',
      whiteSpace: 'nowrap',
      fontSize: '0.8125rem',
    },
    '& th': {
      fontWeight: 600,
      color: theme.palette.text.secondary,
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
  moreRow: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  nullValue: {
    fontStyle: 'italic',
    fontWeight: 400,
    color: theme.palette.text.secondary,
  },
}));

const formatSize = bytes => {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
};

const MAX_DISPLAY = 5;

const BBOX_SOURCE = 'file-preview-bbox';

const showBbox = (map, bbox, color) => {
  const data = getBboxPolygon(bbox);
  const source = map.getSource(BBOX_SOURCE);
  if (source) {
    source.setData(data);
  } else {
    map.addSource(BBOX_SOURCE, { type: 'geojson', data });
    map.addLayer({
      id:     `${BBOX_SOURCE}-fill`,
      type:   'fill',
      source: BBOX_SOURCE,
      paint:  { 'fill-color': color, 'fill-opacity': 0.2 },
    });
    map.addLayer({
      id:     `${BBOX_SOURCE}-line`,
      type:   'line',
      source: BBOX_SOURCE,
      paint:  { 'line-color': color, 'line-width': 2 },
    });
  }
  // La carte était masquée tant qu'aucune emprise n'était connue
  map.resize();
  map.fitBounds(bbox, { padding: 20, animate: false });
};

const BBoxMap = ({ bbox }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [map, setMap] = React.useState(null);
  const { containerRef } = useMaplibreMap({ onReady: setMap });

  const hasBbox = bbox?.length === 4;

  React.useEffect(() => {
    if (map && hasBbox) {
      showBbox(map, bbox, palette.primary.main);
    }
  }, [map, bbox, hasBbox, palette.primary.main]);

  return (
    <>
      {/* La carte reste montée : la recréer à chaque aperçu coûte un contexte WebGL */}
      <div
        ref={containerRef}
        className={classes.map}
        style={hasBbox ? undefined : { display: 'none' }}
      />
      {!hasBbox && (
        <div className={classes.mapPlaceholder}>
          <MapIcon />
          <Typography variant="body2">
            {t('datasource.form.preview.no-geodata')}
          </Typography>
        </div>
      )}
    </>
  );
};

const FilePreview = ({
  preview, loading, error, bbox, isEditMode,
}) => {
  const classes = useStyles();
  const { input: { value: fileValue } } = useField('file');
  const { input: { value: layerName } } = useField('layer_name');
  const { t } = useTranslation();

  if (!isEditMode && !fileValue?.rawFile) return null;

  const {
    record_count: recordCount,
    geometry_type_name: geomName,
    geometry_types: geomTypes,
    mixed_geometries: mixedGeometries,
    crs, fields, features,
    file_size: fileSize,
    column_count: columnCount,
  } = preview ?? {};

  const hasMore = recordCount > MAX_DISPLAY;
  const hasGeom = !!geomName || !!geomTypes?.length;
  const geomLabel = mixedGeometries ? geomTypes?.join(', ') : geomName;
  const fileSizeLabel = formatSize(fileValue?.rawFile?.size ?? fileSize);
  const isGpkgFile = fileValue?.rawFile?.name?.toLowerCase().endsWith('.gpkg');

  return (
    <Accordion defaultExpanded style={{ marginTop: 8, marginBottom: 8 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography style={{ fontWeight: 'bold' }}>
          {t('datasource.form.preview.title')}
          {fileSizeLabel && ` (${fileSizeLabel})`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails style={{ flexDirection: 'column', padding: '0 16px 12px' }}>
        <div className={classes.previewBody}>
          {loading && preview && <LinearProgress style={{ marginBottom: 8 }} />}
          {error ? (
            <Typography color="error" style={{ padding: 8 }}>{error}</Typography>
          ) : (
            <div className={loading && preview ? classes.oldContent : undefined}>
              {loading && !preview ? (
                <>
                  <Skeleton variant="rect" width="70%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton variant="rect" height={180} style={{ marginBottom: 8 }} />
                  <Skeleton variant="rect" height={240} style={{ marginTop: 8, borderRadius: 4 }} />
                </>
              ) : (
                <>
                  {preview && (
                    <>
                      <div className={classes.meta}>
                        <Typography variant="body2" className={classes.metaItem}>
                          {t('datasource.form.preview.row-count')}{' '}
                          <strong>{recordCount.toLocaleString()}</strong>
                        </Typography>
                        {columnCount > 0 && (
                        <Typography variant="body2" className={classes.metaItem}>
                          {t('datasource.form.preview.column-count')}{' '}
                          <strong>{columnCount}</strong>
                        </Typography>
                        )}
                        {hasGeom && (
                        <Typography variant="body2" className={classes.metaItem}>
                          {t('datasource.form.preview.geom-type')}{' '}
                          <strong>{geomLabel}</strong>
                        </Typography>
                        )}
                        {crs && (
                        <Typography variant="body2" className={classes.metaItem}>
                          {t('datasource.form.preview.crs')}{' '}
                          <strong>{crs}</strong>
                        </Typography>
                        )}
                      </div>

                      {mixedGeometries && (
                      <Alert severity="warning" style={{ marginBottom: 8 }}>
                        {t('datasource.form.preview.mixed-geometries-warning')}
                      </Alert>
                      )}

                      <Divider style={{ marginBottom: 8 }} />

                      {(fields ?? []).length > 0 && (
                      <TableContainer>
                        <table className={classes.table}>
                          <thead>
                            <tr>
                              {fields.map(field => (
                                <th
                                  key={field.name}
                                  style={field.type === 'int' || field.type === 'float' ? { textAlign: 'right' } : undefined}
                                >
                                  {field.name} ({field.type})
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {features.map((row, i) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <tr key={i}>
                                {fields.map(field => (
                                  <td
                                    key={field.name}
                                    style={field.type === 'int' || field.type === 'float' ? { textAlign: 'right' } : undefined}
                                  >
                                    {row[field.name] != null
                                      ? String(row[field.name])
                                      : <span className={classes.nullValue}>null</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                            {hasMore && (
                            <tr>
                              <td
                                colSpan={fields.length}
                                className={classes.moreRow}
                              >
                                + {recordCount - MAX_DISPLAY}{' '}
                                {t('datasource.form.preview.rows')}
                              </td>
                            </tr>
                            )}
                          </tbody>
                        </table>
                      </TableContainer>
                      )}

                      <BBoxMap bbox={bbox} />
                      {bbox && (
                      <Typography variant="caption" className={classes.moreRow} style={{ paddingLeft: 4 }}>
                        {t('datasource.form.preview.extent-hint')}
                      </Typography>
                      )}
                    </>
                  )}
                  {!preview && !loading && !error && isGpkgFile && !layerName && (
                  <Typography variant="body2" className={classes.metaItem}>
                    {t('datasource.form.preview.no-layer')}
                  </Typography>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilePreview;
