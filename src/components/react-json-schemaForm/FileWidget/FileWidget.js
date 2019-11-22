import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dataURItoBlob, shouldRender } from 'react-jsonschema-form/lib/utils';
import { Button } from '@blueprintjs/core';

import './styles.scss';

// Component copied from https://github.com/rjsf-team/react-jsonschema-form/blob/master/packages/core/src/components/widgets/FileWidget.js
// With the additional remove file feature

function addNameToDataURL (dataURL, name) {
  return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}

function processFile (file) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = event => {
      resolve({
        dataURL: addNameToDataURL(event.target.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}

function processFiles (files) {
  return Promise.all([].map.call(files, processFile));
}

function FilesInfo (props) {
  const { filesInfo } = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info">
      {filesInfo.map((fileInfo, key) => {
        const { name, size, type } = fileInfo;
        return (
          // eslint-disable-next-line react/no-array-index-key
          <li key={key}>
            <strong>{name}</strong> ({type}, {size} bytes)
          </li>
        );
      })}
    </ul>
  );
}

function extractFileInfo (dataURLs) {
  return dataURLs
    .filter(dataURL => typeof dataURL !== 'undefined')
    .map(dataURL => {
      const { blob, name } = dataURItoBlob(dataURL);
      return {
        name,
        size: blob.size,
        type: blob.type,
      };
    });
}

class FileWidget extends Component {
  inputRef = React.createRef();

  constructor (props) {
    super(props);
    const { value } = props;
    const values = Array.isArray(value) ? value : [value];
    this.state = { filesInfo: extractFileInfo(values) };
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onChange = event => {
    const { multiple, onChange } = this.props;
    processFiles(event.target.files).then(filesInfo => {
      const state = {
        values: filesInfo.map(fileInfo => fileInfo.dataURL),
        filesInfo,
      };
      this.setState(state, () => {
        if (multiple) {
          onChange(state.values);
        } else {
          onChange(state.values[0]);
        }
      });
    });
  };

  onRemove = () => {
    const { onChange } = this.props;
    this.inputRef.current.value = '';
    this.setState({
      filesInfo: [],
    }, () => {
      onChange(undefined);
    });
  }

  render () {
    const { multiple, id, readonly, disabled, autofocus, options } = this.props;
    const { filesInfo } = this.state;

    return (
      <div className="fileWidget">
        <p className="fileWidget__field">
          <input
            className="fileWidget__input"
            ref={this.inputRef}
            id={id}
            type="file"
            disabled={readonly || disabled}
            onChange={this.onChange}
            defaultValue=""
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autofocus}
            multiple={multiple}
            accept={options.accept}
          />
          {filesInfo.length > 0 && <Button onClick={this.onRemove} icon="trash" minimal />}
        </p>
        <FilesInfo filesInfo={filesInfo} inputRef={this.inputRef} onRemove={this.onRemove} />
      </div>
    );
  }
}

FileWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  FileWidget.propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    autofocus: PropTypes.bool,
  };

  FileWidget.defaultProps = {
    multiple: false,
    value: [],
    autofocus: false,
  };
}

export default FileWidget;
