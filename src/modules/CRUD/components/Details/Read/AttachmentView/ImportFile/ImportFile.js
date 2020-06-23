import React from 'react';
import PropTypes from 'prop-types';
import { Button, Intent } from '@blueprintjs/core';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import { buildHeaders } from '@terralego/core/modules/Api';

import XHRUpload from '@uppy/xhr-upload';
import classNames from 'classnames';
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
      category: false,
      isCategoryActive: false,
      isDashboardOpen: false,
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
      onBeforeFileAdded: () => {
        this.setState({
          isCategoryActive: true,
        });
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

    this.toggleActiveCategory = isCategoryActive => this.setState({ isCategoryActive });

    this.handleActiveCategory = () => this.toggleActiveCategory(true);
    this.handleInactiveCategory = () => this.toggleActiveCategory(false);
    this.handleFileRemoved = () => {
      if (!this.uppy.getFiles().length) {
        this.toggleActiveCategory(false);
      }
    };
    this.handleFileAdded = () => {
      setTimeout(() => {
        this.toggleUploadButton();
      });
    };
    this.handleComplete = () => {
      fetchFeature(featureEndpoint, id);
    };

    ['dashboard:file-edit-complete', 'info-hidden'].forEach(event => {
      this.uppy.on(event, this.handleActiveCategory);
    });
    ['cancel-all', 'dashboard:file-edit-start', 'info-visible', 'upload'].forEach(event => {
      this.uppy.on(event, this.handleInactiveCategory);
    });
    this.uppy.on('file-removed', this.handleFileRemoved);
    this.uppy.on('file-added', this.handleFileAdded);
    this.uppy.on('complete', this.handleComplete);
  }

  componentDidUpdate = (prevProps, { category: prevCategory }) => {
    const { category } = this.state;
    if (prevCategory !== category) {
      this.toggleUploadButton();
    }
  }

  componentWillUnmount () {
    ['dashboard:file-edit-complete', 'info-hidden'].forEach(event => {
      this.uppy.off(event, this.handleActiveCategory);
    });
    ['cancel-all', 'dashboard:file-edit-start', 'info-visible', 'upload'].forEach(event => {
      this.uppy.off(event, this.handleInactiveCategory);
    });
    this.uppy.off('file-removed', this.handleFileRemoved);
    this.uppy.off('file-added', this.handleFileAdded);
    this.uppy.off('complete', this.handleComplete);
    this.uppy.reset();
    this.uppy.close();
  }

  toggleUploadButton = () => {
    const { category } = this.state;
    const { current: { container } = {} } = this.dashboard;
    const button = container.querySelector('.uppy-StatusBar-actionBtn--upload');
    if (button) {
      const setOrRemoveAttribute = category.name ? 'removeAttribute' : 'setAttribute';
      button[setOrRemoveAttribute]('disabled', true);
    }
  }

  handleCategoryChange = category => {
    this.setState({ category });
    this.uppy.setMeta({ category });
  }

  toggleDashboard = () => {
    this.setState(({ isDashboardOpen }) => ({
      isDashboardOpen: !isDashboardOpen,
    }), () => {
      const { isDashboardOpen } = this.state;
      if (!isDashboardOpen) {
        this.uppy.reset();
      }
    });
  }

  render () {
    const { isCategoryActive, isDashboardOpen } = this.state;
    const { name, feature: { [name]: attachments }, t } = this.props;

    return (
      <div className={classNames({
        importFile: true,
        'importFile--opened': isDashboardOpen,
      })}
      >
        <Button
          className={classNames({
            'importFile__bt-import': true,
            'importFile__bt-import--cancel': isDashboardOpen,
          })}
          icon={isDashboardOpen ? 'small-cross' : 'cloud-upload'}
          intent={Intent.PRIMARY}
          minimal={isDashboardOpen}
          onClick={this.toggleDashboard}
          text={isDashboardOpen ? t('CRUD.details.close') : t('CRUD.details.attachment.loadFiles')}
        />
        {isDashboardOpen && (
          <>
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
            <div className={classNames({
              importFile__category: true,
              'importFile__category--active': isCategoryActive,
            })}
            >
              <CategorySelector
                attachment={name}
                attachments={attachments}
                onSubmit={this.handleCategoryChange}
              />
            </div>
          </>
        )}
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
