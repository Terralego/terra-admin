import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@blueprintjs/core';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { buildHeaders } from '@terralego/core/modules/Api';

import XHRUpload from '@uppy/xhr-upload';
import { getLocale } from './uppy-locales';

import UppySetCategoryBeforeUpload from './UppySetCategoryBeforeUpload';
import CategorySelector from '../CategorySelector';

import '@uppy/core/dist/style.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@uppy/dashboard/dist/style.css';
import './styles.scss';

class ImportFile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      category: props.category || false,
    };

    this.dashboard = React.createRef();

    const {
      feature,
      featureEndpoint,
      fetchFeature,
      fileAllowedFileTypes,
      imageAllowedFileTypes,
      i18n: { language = 'default' },
      match: { params: { id } },
      maxFileSize,
      name,
      t,
    } = props;

    const allowedFileTypes = name ===  'attachments' ? fileAllowedFileTypes : imageAllowedFileTypes;
    const dropPasteAndAllowedFileTypes = allowedFileTypes ? t('CRUD.details.attachment.allowedFileTypes', { files: allowedFileTypes }) : '';

    const locale = getLocale(language);

    this.uppy = Uppy({
      restrictions: {
        maxFileSize,
        allowedFileTypes,
      },
      autoProceed: false,
      locale: {
        ...locale,
        strings: {
          ...locale.strings,
          dropPaste: `${locale.strings.dropPaste} ${dropPasteAndAllowedFileTypes}`,
        },
      },
      onBeforeUpload: files => {
        const file = name ===  'attachments' ? 'file' : 'image';
        const updatedFiles = {};
        Object.keys(files).forEach(fileId => {
          const { meta, data } = files[fileId];
          updatedFiles[fileId] = {
            ...files[fileId],
            meta: {
              ...meta,
              legend: meta.name,
              [file]: data,
            },
          };
        });
        return updatedFiles;
      },
    });

    this.uppy.use(UppySetCategoryBeforeUpload, {
      props: this.props,
    });

    this.uppy.use(XHRUpload, {
      endpoint: `/api/crud/features/${feature.identifier}/${name}/`,
      headers: buildHeaders(),
    });

    this.handleComplete = () => {
      fetchFeature(featureEndpoint, id);
    };

    this.uppy.on('complete', this.handleComplete);
  }

  componentWillUnmount () {
    this.uppy.off('complete', this.handleComplete);
    this.uppy.reset();
    this.uppy.close();
  }


  handleCategoryChange = category => {
    this.setState({ category });
    this.uppy.setMeta({ category });
  }

  render () {
    const { category } = this.state;
    const { name, feature: { [name]: attachments }, t } = this.props;


    if (!category) {
      return (
        <CategorySelector
          attachment={name}
          attachments={attachments}
          onSubmit={this.handleCategoryChange}
        />
      );
    }

    return (
      <div className="importFile">
        <div className="importFile__category">
          <>{t('CRUD.details.attachment.category.selected')} </>
          <Tag onRemove={() => this.setState({ category: null })}>{category.name}</Tag>
        </div>
        <Dashboard
          height={380}
          metaFields={[
            { id: 'name', name: t('CRUD.details.attachment.label') },
          ]}
          proudlyDisplayPoweredByUppy={false}
          ref={this.dashboard}
          replaceTargetContent
          showProgressDetails
          uppy={this.uppy}
          width="auto"
        />
      </div>
    );
  }
}

ImportFile.propTypes = {
  feature: PropTypes.shape({}),
  featureEndpoint: PropTypes.string,
  fetchFeature: PropTypes.func,
  fileAllowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  imageAllowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  i18n: PropTypes.shape({
    language: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  maxFileSize: PropTypes.number,
  name: PropTypes.string.isRequired,
  t: PropTypes.func,
};

ImportFile.defaultProps = {
  feature: {},
  featureEndpoint: undefined,
  fetchFeature: () => {},
  fileAllowedFileTypes: null,
  imageAllowedFileTypes: null,
  i18n: {
    language: 'default',
  },
  match: {
    params: {
      id: undefined,
    },
  },
  maxFileSize: null,
  t: () => {},
};

export default ImportFile;
