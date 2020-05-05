import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';

import DefaultLabel from '../DefaultLabel';
import PictureSelector from './PictureSelector';
import './styles.scss';

export default class RTEField extends Component {
  static propTypes = {
    uiSchema: PropTypes.shape({
      'ui:field': PropTypes.string,
    }).isRequired,
    schema: PropTypes.shape({}).isRequired,
    formData: PropTypes.string,
    required: PropTypes.bool,
    t: PropTypes.func,
  };

  static defaultProps = {
    formData: undefined,
    required: false,
    t: text => text,
  }

  RTERef = React.createRef();

  RTEHiddenRef = React.createRef();

  state = {
    openAttachments: false,
  }

  componentDidMount () {
    const {
      formData,
      t,
      uiSchema: {
        'ui:placeholder': placeholder,
      },
    } = this.props;

    this.quill = new Quill(this.RTERef.current, {
      modules: {
        clipboard: { matchVisual: false },
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image'],
          ['clean'],
        ],
      },
      theme: 'snow',
      placeholder,
    });

    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', this.handleOpenAttachment);

    this.quill.setContents(this.quill.clipboard.convert(formData));

    this.editor = this.RTERef.current.querySelector('.ql-editor');
    this.quill.on('text-change', this.onTextChange);

    ['linkLabel', 'linkSave'].forEach(item => {
      this.RTERef.current.style.setProperty(`--quill-${item}`, `'${t(`quill.${item}`)}'`);
    });
  }

  componentWillUnmount () {
    this.quill.off('text-change', this.onTextChange);
    this.quill = null;
    ['linkLabel', 'linkSave'].forEach(item => {
      this.RTERef.current.style.removeProperty(`--quill-${item}`);
    });
  }

  onTextChange = (delta, oldDelta, source) => {
    const { schema: { maxLength } } = this.props;
    const value = this.editor.innerHTML === '<p><br></p>'
      ? ''
      : this.editor.innerHTML;
    this.RTEHiddenRef.current.value = value;
    this.updateFormData(value);

    if (maxLength && this.quill.getLength() > maxLength && source === 'user') {
      this.quill.deleteText(maxLength, Infinity);
    }
  };

  updateFormData = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  handleOpenAttachment = () => {
    this.setState({ openAttachments: true });
  };

  handleCloseAttachment = () => {
    this.setState({ openAttachments: false });
  }

  handleSubmitAttachment = value => {
    this.handleCloseAttachment();
    this.quill.focus();
    const { index, length } = this.quill.getSelection() || {};
    if (!index && !value) {
      return;
    }
    if (length) {
      this.quill.deleteText(index, length);
    }
    this.quill.insertEmbed(index, 'image', value);
  }

  render () {
    const {
      id,
      required,
      uiSchema: {
        'ui:placeholder': placeholder,
      },
    } = this.props;

    const { openAttachments } = this.state;

    return (
      <div className="RTEField">
        <DefaultLabel {...this.props} />
        <div
          id={id}
          ref={this.RTERef}
          className="RTEField__input"
        />
        <input
          ref={this.RTEHiddenRef}
          className="RTEField__inputHidden"
          required={required}
          placeholder={placeholder}
        />
        {openAttachments && (
          <PictureSelector
            onClose={this.handleCloseAttachment}
            onSubmit={this.handleSubmitAttachment}
          />
        )}
      </div>
    );
  }
}
