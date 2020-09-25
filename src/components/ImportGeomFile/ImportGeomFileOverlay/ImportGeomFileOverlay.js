import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Callout, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import * as toGeojson from '@tmcw/togeojson';

import {
  ALL,
  MULTI_POINT,
  MULTI_LINESTRING,
  MULTI_POLYGON,
  geomTypeList,
} from '../../../utils/geom';

// '@tmcw/togeojson' package can only convert KML, TCX and GPX files for the moment
const ALL_ACCEPTED_EXTENSIONS = Object.keys(toGeojson).filter(method => !method.endsWith('Gen'));

const getGeojson = (data, fileExtension) => {
  let geom = null;
  let error = null;
  const xml = new DOMParser().parseFromString(data, 'text/xml');
  try {
    const xmlConverter = toGeojson[fileExtension];
    geom = xmlConverter(xml);
  } catch ({ name }) {
    error = name;
  }
  return { geom, error };
};

const getFeatures = (geom, geomType, t) => {
  if (!geom) {
    return {
      features: null,
    };
  }

  const { features } = geom;
  const geomTypeName = geomTypeList[geomType];
  const isMultiGeom = [ALL, MULTI_POINT, MULTI_LINESTRING, MULTI_POLYGON].includes(geomType);
  const filteredGeom = features.filter(({ geometry: { type } }) => type === geomTypeName);

  const warnings = [];
  if (features.length > filteredGeom.length) {
    warnings.push(t('importGeomFile.warnGeomOtherType'));
  }

  if (isMultiGeom) {
    return {
      features: filteredGeom,
      warnings,
    };
  }

  if (filteredGeom.length > 1) {
    warnings.push(t('importGeomFile.warnGeomSameType'));
  }

  const [firstItem] = filteredGeom;

  if (!firstItem) {
    warnings.push(t('importGeomFile.warnNoGeomFound'));
  }

  return {
    features: firstItem ? [firstItem] : [],
    warnings,
  };
};

const ImportGeomFileOverlay = ({ geomType, onChange, acceptedExtensions: extensions }) => {
  const [geojson, setGeojson] = useState({});
  const [fileName, setFileName] = useState(null);

  const { t } = useTranslation();

  const acceptedExtensions = useMemo(() => (
    extensions.filter(ext => ALL_ACCEPTED_EXTENSIONS.includes(ext))
  ), [extensions]);


  const handleReset = () => {
    setFileName(null);
    setGeojson({});
  };

  const handleChange = useCallback(({ target: { files: [file] } }) => {
    handleReset();
    const { name } = file;
    setFileName(name);
    const [, fileExtension] = name.split('.');
    if (!acceptedExtensions.includes(fileExtension)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      setGeojson(getGeojson(result, fileExtension));
    };
    reader.readAsText(file);
  }, [acceptedExtensions]);

  const accept = acceptedExtensions.map(ext => `.${ext}`).join(',');

  const { error, geom } = geojson;

  const { features, warnings } = useMemo(() => getFeatures(geom, geomType, t), [geom, geomType, t]);

  useEffect(() => {
    onChange(features);
  }, [features, onChange]);

  const featuresLength = features?.length;

  return (
    <>
      <Callout className="importGeomFile__info" intent={Intent.PRIMARY}>
        <p>{t('importGeomFile.intro1')}</p>
        <p>{t('importGeomFile.intro2')}</p>
        <Callout intent={Intent.WARNING}>
          <Trans i18nKey="importGeomFile.intro3">
            If you started drawing before validating the import,
            it will be <strong>replaced</strong>.
          </Trans>
        </Callout>
      </Callout>

      <FormGroup
        label={t('importGeomFile.title')}
        labelFor="import-geomFile"
        helperText={t('importGeomFile.accept', { accept })}
      >
        {error && (
          <Callout className="importGeomFile__canDelete importGeomFile__warning" intent={Intent.DANGER}>
            <p>
              <Trans i18nKey="importGeomFile.unableToImport">
                Unable to load and read <em>{{ fileName }}</em> data
              </Trans>
            </p>
            <Button minimal icon="cross" onClick={handleReset} />
          </Callout>
        )}
        {features && (
          <Callout className="importGeomFile__canDelete" intent={featuresLength ? Intent.SUCCESS : Intent.WARNING}>
            <div>
              {featuresLength
                ? <p>{t('importGeomFile.readyToImport', { fileName, count: featuresLength })}</p>
                : <p>{t('importGeomFile.nothingToImport', { fileName })}</p>}
              {warnings && (
                <Callout intent={Intent.PRIMARY}>
                  {/* eslint-disable-next-line react/no-array-index-key */}
                  {warnings.map((warn, index) => <p key={index}>{warn}</p>)}
                </Callout>
              )}
            </div>
            <Button minimal icon="cross" onClick={handleReset} />
          </Callout>
        )}
        {!error && !features && (
          <InputGroup
            accept={accept}
            id="import-geomFile"
            onChange={handleChange}
            type="file"
          />
        )}
      </FormGroup>
    </>
  );
};


ImportGeomFileOverlay.propTypes = {
  acceptedExtensions: PropTypes.arrayOf(PropTypes.string),
  geomType: PropTypes.number,
  onChange: PropTypes.func,
};

ImportGeomFileOverlay.defaultProps = {
  acceptedExtensions: ['gpx'],
  geomType: undefined,
  onChange () {},
};

export default ImportGeomFileOverlay;
