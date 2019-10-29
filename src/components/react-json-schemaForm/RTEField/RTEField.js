import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';

import DefaultLabel from '../DefaultLabel';
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

  componentDidMount () {
    const {
      formData,
      t,
      uiSchema: {
        'ui:placeholder': placeholder,
      },
    } = this.props;

    this.quill = new Quill(this.RTERef.current, {
      modules: { clipboard: { matchVisual: false } },
      theme: 'snow',
      placeholder,
    });

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

  onTextChange = () => {
    const value = this.editor.innerHTML === '<p><br></p>'
      ? ''
      : this.editor.innerHTML;
    this.RTEHiddenRef.current.value = value;
    this.updateFormData(value);
  };

  updateFormData = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render () {
    const {
      id,
      required,
      uiSchema: {
        'ui:placeholder': placeholder,
      },
    } = this.props;

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
      </div>
    );
  }
}
