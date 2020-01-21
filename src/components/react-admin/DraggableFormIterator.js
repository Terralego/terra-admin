/**
 * This DraggableFormIterator is inspired from SimpleFormIterator and the PR at
 * https://github.com/marmelab/react-admin/pull/1836
 *
 * It has greatly diverged from SimpleFormIterator to integrate the HoC from
 * react-sortable-hoc, but the ids and item handling in the class should stay
 * close to original implementation.
 */

import React, { Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

/* eslint-disable import/no-extraneous-dependencies */
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import CloseIcon from '@material-ui/icons/RemoveCircleOutline';
import get from 'lodash/get';
import { translate as RAtranslate } from 'ra-core';
import FormInput from 'ra-ui-materialui/lib/form/FormInput';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
/* eslint-disable import/no-extraneous-dependencies */

import compose from '../../utils/compose';
import './draggable.scss';

const DragHandle = sortableHandle(props => (
  <span {...props}>
    <DragHandleIcon />
  </span>
));

const SortableItem = SortableElement(
  ({
    classes = {},
    sortIndex: index,
    children,
    basePath,
    resource,
    disableRemove,
    records,
    ids,
    removeItem,
    source,
    item,
    translate,
  }) => (
    <CSSTransition key={ids[index]} timeout={500} classNames="fade">
      <li className={classes.line}>
        <Typography variant="body1" className={classes.index}>
          <span>{index + 1}</span>
          <DragHandle className={classes.dragHandle} />
        </Typography>
        <section className={classes.form}>
          {Children.map(children, input => (
            <FormInput
              basePath={input.props.basePath || basePath}
              input={cloneElement(input, {
                source: input.props.source
                  ? `${item}.${input.props.source}`
                  : item,
                index,
                label: input.props.label || input.props.source,
              })}
              record={(records && records[index]) || {}}
              resource={resource}
            />
          ))}
        </section>
        {!disableRemove && (
          <span className={classes.action}>
            <Button
              className={classNames(
                'button-remove',
                `button-remove-${source}-${index}`,
              )}
              size="small"
              onClick={removeItem(index)}
            >
              <CloseIcon className={classes.leftIcon} />
              {translate('ra.action.remove')}
            </Button>
          </span>
        )}
      </li>
    </CSSTransition>
  ),
);

const SortableList = SortableContainer(props => {
  const {
    items,
    classes = {},
    meta: { error, submitFailed },
    translate,
    disableAdd,
    source,
    addItem,
  } = props;
  return (
    <ul className={classNames(classes.root, 'draggable-list')}>
      {submitFailed && error && <span>{error}</span>}
      <TransitionGroup>
        {items.map((item, index) => (
          <SortableItem
            {...props}
            // eslint-disable-next-line react/no-array-index-key
            key={`sortable-item-${index}`}
            item={item}
            index={index}
            sortIndex={index}
          />
        ))}
      </TransitionGroup>
      {!disableAdd && (
        <li className={classes.line}>
          <span className={classes.action}>
            <Button
              className={classNames('button-add', `button-add-${source}`)}
              size="small"
              onClick={addItem}
            >
              <AddIcon className={classes.leftIcon} />
              {translate('ra.action.add')}
            </Button>
          </span>
        </li>
      )}
    </ul>
  );
});

const styles = theme => ({
  root: {
    padding: 0,
    marginBottom: 0,
    '& > li:last-child': {
      borderBottom: 'none',
    },
  },
  line: {
    display: 'flex',
    listStyleType: 'none',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    [theme.breakpoints.down('xs')]: { display: 'block' },
    '&.fade-enter': {
      opacity: 0.01,
      transform: 'translateX(100vw)',
    },
    '&.fade-enter-active': {
      opacity: 1,
      transform: 'translateX(0)',
      transition: 'all 500ms ease-in',
    },
    '&.fade-exit': {
      opacity: 1,
      transform: 'translateX(0)',
    },
    '&.fade-exit-active': {
      opacity: 0.01,
      transform: 'translateX(100vw)',
      transition: 'all 500ms ease-in',
    },
  },
  dragHandle: {
    cursor: 'row-resize',
  },
  fieldIndex: {
    textAlign: 'center',
    fontSize: '2em',
  },
  index: {
    width: '3em',
    paddingTop: '2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },
  form: { flex: 2, paddingLeft: '0.5em' },
  action: {
    paddingTop: '0.5em',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export class DraggableFormIterator extends Component {
  constructor (props) {
    super(props);
    this.setIds();
  }

  setIds () {
    const { fields, defaultValue } = this.props;
    // we need a unique id for each field for a proper enter/exit animation
    // but redux-form doesn't provide one (cf https://github.com/erikras/redux-form/issues/2735)
    // so we keep an internal map between the field position and an autoincrement id
    const defaultId = defaultValue ? defaultValue.length : 0;
    this.nextId = fields.length ? fields.length : defaultId;

    // We check whether we have a defaultValue (which must be an array) before checking
    // the fields prop which will always be empty for a new record.
    // Without it, our ids wouldn't match the default value and we would get key warnings
    // on the CssTransition element inside our render method
    this.ids = this.nextId > 0 ? Array.from(Array(this.nextId).keys()) : [];
    this.ids = Array.from({ length: this.nextId }, (_, index) => index);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const { fields, onSortEnd } = this.props;
      fields.move(oldIndex, newIndex);
      onSortEnd(fields, oldIndex, newIndex);
    }
  };

  removeItem = index => () => {
    const { fields } = this.props;
    this.ids.splice(index, 1);
    fields.remove(index);
  };

  addItem = () => {
    const { fields } = this.props;
    this.ids.push(this.nextId);
    this.nextId += 1;
    fields.push({});
  };

  render () {
    const { record, source, fields } = this.props;

    if (this.ids.length !== fields.length) {
      this.ids = Object.keys([...Array(fields.length)]);
    }

    const records = get(record, source);
    return fields ? (
      <SortableList
        items={fields}
        ids={this.ids}
        records={records}
        source={source}
        removeItem={this.removeItem}
        addItem={this.addItem}
        {...this.props}
        onSortEnd={this.onSortEnd}
        useDragHandle
      />
    ) : null;
  }
}

DraggableFormIterator.defaultProps = {
  disableAdd: false,
  disableRemove: false,
};

DraggableFormIterator.propTypes = {
  // These come from SimpleFormIterator
  /* eslint-disable react/require-default-props, react/forbid-prop-types */
  defaultValue: PropTypes.any,
  basePath: PropTypes.string,
  children: PropTypes.node,
  classes: PropTypes.object,
  className: PropTypes.string,
  fields: PropTypes.object,
  meta: PropTypes.object,
  record: PropTypes.object.isRequired,
  source: PropTypes.string,
  resource: PropTypes.string,
  translate: PropTypes.func,
  /* eslint-enable react/require-default-props, react/forbid-prop-types */
  disableAdd: PropTypes.bool,
  disableRemove: PropTypes.bool,
};

export default compose(RAtranslate, withStyles(styles))(DraggableFormIterator);
