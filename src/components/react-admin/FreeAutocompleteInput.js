import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

/* eslint-disable import/no-extraneous-dependencies */
import get from 'lodash.get';
import isEqual from 'lodash/isEqual';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Autosuggest from 'react-autosuggest';
import compose from 'recompose/compose';
import { withStyles, createStyles } from '@material-ui/core/styles';
/* eslint-enable */

import { addField, translate, FieldTitle } from 'react-admin';

const styles = theme =>
  createStyles({
    container: {
      flexGrow: 1,
      position: 'relative',
    },
    root: {},
    suggestionsContainerOpen: {
      position: 'absolute',
      marginBottom: theme.spacing.unit * 3,
      zIndex: 2,
    },
    suggestionsPaper: {
      maxHeight: '50vh',
      overflowY: 'auto',
    },
    suggestion: {
      display: 'block',
      fontFamily: theme.typography.fontFamily,
    },
    suggestionText: { fontWeight: 300 },
    highlightedSuggestionText: { fontWeight: 500 },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
  });

/**
 * An Input component mainly taken from default AutocompleteInput, but that
 * allows free text input.
 */
export class FreeAutocompleteInput extends React.Component {
  state = {
    dirty: false,
    inputValue: null,
    searchText: '',
    selectedItem: null,
    suggestions: [],
  };

  ignoreNextChoicesUpdate = false;

  inputEl = null;

  anchorEl = null;

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    const { choices, limitChoicesToValue, input } = this.props;
    const { value } = input;
    const selectedItem = this.getSelectedItem(
      this.props,
      value,
    );
    this.setState({
      selectedItem,
      inputValue: value,
      searchText: value,
      suggestions:
        limitChoicesToValue && selectedItem
          ? [selectedItem]
          : choices,
    });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { choices: nextChoices, input, limitChoicesToValue } = nextProps;
    const { inputValue } = this.state;
    const { choices } = this.props;
    if (input.value !== inputValue) {
      const selectedItem = this.getSelectedItem(nextProps, input.value);
      this.setState({
        selectedItem,
        inputValue: input.value,
        searchText: this.getSuggestionText(selectedItem),
        dirty: false,
        suggestions:
          limitChoicesToValue && selectedItem
            ? [selectedItem]
            : choices,
        prevSuggestions: false,
      });
      // Avoid displaying the suggestions again when one just has been selected
      this.ignoreNextChoicesUpdate = true;
      // Ensure to reset the filter
      this.updateFilter('');
    } else if (!isEqual(nextChoices, choices)) {
      if (this.ignoreNextChoicesUpdate) {
        this.ignoreNextChoicesUpdate = false;
        return;
      }
      const selectedItem = this.getSelectedItem(
        nextProps,
        inputValue,
      );
      this.setState(({ dirty, searchText }) => ({
        selectedItem,
        searchText: dirty
          ? searchText
          : this.getSuggestionText(selectedItem),
        suggestions:
          limitChoicesToValue && !dirty && selectedItem
            ? [selectedItem]
            : nextChoices,
        prevSuggestions: false,
      }));
    }
  }

  getSelectedItem = ({ choices }, inputValue) =>
    (choices && inputValue
      ? choices.find(
        choice => this.getSuggestionValue(choice) === inputValue,
      )
      : inputValue);

  getSuggestionValue = suggestion => {
    const { optionValue } = this.props;
    return get(suggestion, optionValue);
  };

  getSuggestionText = suggestion => {
    if (!suggestion) return '';

    const { optionText, translate: translateFn, translateChoice } = this.props;
    const suggestionLabel =
      typeof optionText === 'function'
        ? optionText(suggestion)
        : get(suggestion, optionText, '');

    // We explicitly call toString here because AutoSuggest expect a string
    return translateChoice
      ? translateFn(suggestionLabel, { _: suggestionLabel }).toString()
      : suggestionLabel.toString();
  };

  handleSuggestionSelected = (event, { suggestion, method }) => {
    const { input } = this.props;

    const inputValue = this.getSuggestionValue(suggestion);
    if (input && input.onChange) {
      this.setState(
        {
          dirty: false,
          inputValue,
          selectedItem: suggestion,
        },
        () => {
          input.onChange(inputValue);
        },
      );
    }

    if (method === 'enter') {
      event.preventDefault();
    }
  };

  handleSuggestionsFetchRequested = () => {
    this.setState(({ suggestions, prevSuggestions }) => ({
      suggestions: prevSuggestions || suggestions,
    }));
  };

  handleSuggestionsClearRequested = () => {
    this.updateFilter('');
  };

  handleMatchSuggestionOrFilter = inputValue => {
    this.setState({
      dirty: true,
      searchText: inputValue,
    });
    this.updateFilter(inputValue);
  };

  handleChange = (event, { newValue, method }) => {
    const { input } = this.props;
    if (method === 'type') {
      this.setState({
        dirty: true,
        searchText: newValue,
        inputValue: newValue,
      });
      input && input.onChange && input.onChange(newValue);
    }
    if (['click', 'escape'].includes(method)) {
      this.handleMatchSuggestionOrFilter(newValue);
    }
  };

  renderInput = inputProps => {
    const { helperText, input } = this.props;
    const {
      autoFocus,
      className,
      classes = {},
      isRequired,
      label,
      meta,
      onChange,
      resource,
      source,
      value,
      ref,
      options: { InputProps, suggestionsContainerProps, ...options },
      ...other
    } = inputProps;
    if (typeof meta === 'undefined') {
      throw new Error(
        'The TextInput component wasn\'t called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details.',
      );
    }

    const { touched, error } = meta;

    // We need to store the input reference for our Popper element containg the suggestions
    // but Autosuggest also needs this reference (it provides the ref prop)
    const storeInputRef = inputEl => {
      this.inputEl = inputEl;
      this.updateAnchorEl();
      ref(inputEl);
    };

    return (
      <TextField
        label={(
          <FieldTitle
            label={label}
            source={source}
            resource={resource}
            isRequired={isRequired}
          />
        )}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        margin="normal"
        className={classnames(classes.root, className)}
        inputRef={storeInputRef}
        error={!!(touched && error)}
        helperText={(touched && error) || helperText}
        name={input.name}
        {...options}
        InputProps={{
          classes: {
            input: classes.input,
          },
          ...InputProps,
          ...other,
        }}
      />
    );
  };

  renderSuggestionsContainer = autosuggestOptions => {
    const {
      containerProps: { className, ...containerProps },
      children,
    } = autosuggestOptions;
    const { classes = {}, options } = this.props;

    // Force the Popper component to reposition the popup only when
    // this.inputEl is moved to another location
    this.updateAnchorEl();

    return (
      <Popper
        className={className}
        open={Boolean(children)}
        anchorEl={this.anchorEl}
        placement="bottom-start"
        {...options.suggestionsContainerProps}
      >
        <Paper
          square
          className={classes.suggestionsPaper}
          {...containerProps}
        >
          {children}
        </Paper>
      </Popper>
    );
  };

  renderSuggestionComponent = ({
    suggestion,
    query,
    isHighlighted,
    ...props
  }) => <div {...props} />;

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const label = this.getSuggestionText(suggestion);
    const matches = match(label, query);
    const parts = parse(label, matches);
    const { classes = {}, suggestionComponent } = this.props;

    /* eslint-disable react/no-array-index-key */
    return (
      <MenuItem
        selected={isHighlighted}
        component={
          suggestionComponent || this.renderSuggestionComponent
        }
        suggestion={suggestion}
        query={query}
        isHighlighted={isHighlighted}
      >
        <div>
          {parts.map((part, index) => (part.highlight ? (
            <span
              key={index}
              className={classes.highlightedSuggestionText}
            >
              {part.text}
            </span>
          ) : (
            <strong
              key={index}
              className={classes.suggestionText}
            >
              {part.text}
            </strong>
          )))}
        </div>
      </MenuItem>
    );
    /* eslint-enable */
  };

  handleBlur = () => {
    const { dirty, searchText, selectedItem, inputValue } = this.state;
    const { allowEmpty, input } = this.props;
    if (dirty) {
      if (searchText === '' && allowEmpty) {
        input && input.onBlur && input.onBlur(null);
      } else {
        input && input.onBlur && input.onBlur(searchText);
        const { choices, limitChoicesToValue } = this.props;
        this.setState({
          dirty: false,
          selectedItem: searchText,
          inputValue: searchText,
          suggestions:
            limitChoicesToValue && selectedItem
              ? [selectedItem]
              : choices,
        });
        input && input.onChange && input.onChange(searchText);
      }
    } else {
      input && input.onBlur && input.onBlur(inputValue);
    }
  };

  handleFocus = () => {
    const { input } = this.props;
    input && input.onFocus && input.onFocus();
  };

  shouldRenderSuggestions = val => {
    const { shouldRenderSuggestions } = this.props;
    if (
      shouldRenderSuggestions !== undefined &&
      typeof shouldRenderSuggestions === 'function'
    ) {
      return shouldRenderSuggestions(val);
    }

    return true;
  };

  updateFilter = value => {
    const { setFilter, choices } = this.props;
    if (this.previousFilterValue !== value) {
      if (setFilter) {
        setFilter(value);
      } else {
        this.setState({
          suggestions: choices.filter(choice =>
            this.getSuggestionText(choice)
              .toLowerCase()
              .includes(value.toLowerCase())),
        });
      }
    }
    this.previousFilterValue = value;
  };

  updateAnchorEl () {
    if (!this.inputEl) {
      return;
    }

    const inputPosition = this.inputEl.getBoundingClientRect();

    if (!this.anchorEl) {
      this.anchorEl = { getBoundingClientRect: () => inputPosition };
    } else {
      const anchorPosition = this.anchorEl.getBoundingClientRect();

      if (
        anchorPosition.x !== inputPosition.x ||
        anchorPosition.y !== inputPosition.y
      ) {
        this.anchorEl = { getBoundingClientRect: () => inputPosition };
      }
    }
  }

  render () {
    const {
      alwaysRenderSuggestions,
      classes = {},
      isRequired,
      label,
      meta,
      resource,
      source,
      className,
      options,
      ...rest
    } = this.props;
    const { suggestions, searchText } = this.state;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={this.renderInput}
        suggestions={suggestions}
        alwaysRenderSuggestions={alwaysRenderSuggestions}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsFetchRequested={
          this.handleSuggestionsFetchRequested
        }
        onSuggestionsClearRequested={
          this.handleSuggestionsClearRequested
        }
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={this.getSuggestionText}
        renderSuggestion={this.renderSuggestion}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        inputProps={{
          className,
          classes,
          isRequired,
          label,
          meta,
          onChange: this.handleChange,
          resource,
          source,
          value: searchText,
          onBlur: this.handleBlur,
          onFocus: this.handleFocus,
          options,
        }}
        {...rest}
      />
    );
  }
}


/* eslint-disable react/require-default-props,react/forbid-prop-types */
FreeAutocompleteInput.propTypes = {
  allowEmpty: PropTypes.bool,
  alwaysRenderSuggestions: PropTypes.bool, // used only for unit tests
  choices: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
  className: PropTypes.string,
  focusInputOnSuggestionClick: PropTypes.bool,
  InputProps: PropTypes.object,
  input: PropTypes.object,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  limitChoicesToValue: PropTypes.bool,
  meta: PropTypes.object,
  options: PropTypes.object,
  optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  optionValue: PropTypes.string,
  resource: PropTypes.string,
  setFilter: PropTypes.func,
  shouldRenderSuggestions: PropTypes.func,
  source: PropTypes.string,
  suggestionComponent: PropTypes.func,
  translate: PropTypes.func.isRequired,
  translateChoice: PropTypes.bool,
};
/* eslint-enable */

FreeAutocompleteInput.defaultProps = {
  choices: [],
  focusInputOnSuggestionClick: false,
  options: {},
  optionText: 'name',
  optionValue: 'id',
  limitChoicesToValue: false,
  translateChoice: true,
};

export default compose(
  addField,
  translate,
  withStyles(styles),
)(FreeAutocompleteInput);
