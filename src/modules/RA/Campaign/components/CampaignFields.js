import React from 'react';
import PropTypes from 'prop-types';

import {
  DateInput,
  FormTab,
  ReferenceInput,
  SelectInput,
  TabbedForm,
  TextInput,
  TextField,
  Datagrid,
  useGetMany,
  SelectField,
  CreateButton,
} from 'react-admin';

import { useHistory } from 'react-router';

import { useField } from 'react-final-form';

import { withStyles } from '@material-ui/core/styles';

import { RES_USER, RES_PICTURE } from '../../ra-modules';
import compose from '../../../../utils/compose';
import { withMapConfig } from '../../../../hoc/withAppSettings';
import CustomToolbar from './CustomToolbar';
import useUserSettings from '../../../../hooks/useUserSettings';
import { stateChoices } from '../utils';

import AddViewpoint from './AddViewpoint';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const Br = () => <br />;

const toggleSortOrder = prev => (prev === 'DESC' ? 'ASC' : 'DESC');

const defaultValue = [];

const sortBy = sort => (a, b) => {
  if (a[sort.field] < b[sort.field]) {
    return sort.order === 'DESC' ? -1 : 1;
  }
  if (a[sort.field] > b[sort.field]) {
    return sort.order === 'DESC' ? 1 : -1;
  }
  return 0;
};

const AddPictureButton = ({ record }) => {
  const { location } = useHistory();
  return (
    <CreateButton
      basePath="/picture"
      label="resources.campaign.actions.add_picture"
      to={{
        pathname: `/${RES_PICTURE}/create`,
        state: {
          record: { viewpoint: record.id },
          redirect: location.pathname,
        },
      }}
    />
  );
};

const ViewpointGrid = () => {
  const { hasPermission } = useUserSettings();

  const {
    input: { value: viewpoints = [], onChange },
  } = useField('viewpoints', { defaultValue });

  const {
    input: { value: state },
  } = useField('state');

  const { data, total, loaded } = useGetMany('viewpoint', viewpoints);
  const [currentSort, setCurrentSort] = React.useState({ field: 'id', order: 'DESC' });

  const viewpointMap = React.useMemo(
    () =>
      (loaded
        ? data.reduce((acc, elem) => {
          acc[elem.id] = elem;
          return acc;
        }, {})
        : {}),
    [data, loaded],
  );

  const sortedIds = React.useMemo(
    () =>
      (loaded
        ? Object.values(data)
          .sort(sortBy(currentSort))
          .map(({ id }) => id)
        : []),
    [currentSort, data, loaded],
  );

  const onAdd = React.useCallback(
    newIds => {
      const newViewpoints = [...viewpoints];

      newIds.forEach(vid => {
        if (!newViewpoints.includes(vid)) {
          newViewpoints.push(vid);
        }
      });
      onChange(newViewpoints);
    },
    [onChange, viewpoints],
  );

  return (
    <>
      <Datagrid
        basePath=""
        isRowSelectable={() => true}
        currentSort={currentSort}
        data={viewpointMap}
        ids={sortedIds}
        selectedIds={[]}
        loaded={loaded}
        total={total}
        setSort={sortField => {
          setCurrentSort(prevSort =>
            (prevSort.field === sortField
              ? { field: sortField, order: toggleSortOrder(prevSort.order) }
              : { field: sortField, order: 'DESC' }));
        }}
      >
        <TextField source="id" />
        <TextField source="label" />
        {!hasPermission('can_manage_campaigns') && state === 'started' && <AddPictureButton />}
      </Datagrid>
      {hasPermission('can_manage_campaigns') && state === 'draft' && (
        <AddViewpoint textContent={{}} ids={viewpoints} onAdd={onAdd} />
      )}
    </>
  );
};

const PictureFields = ({ edit, classes, mapConfig, location, ...props }) => {
  const { hasPermission } = useUserSettings();
  return (
    <TabbedForm
      {...props}
      toolbar={<CustomToolbar />}
      initialValues={{ viewpoints: [], state: 'draft' }}
    >
      <FormTab label="resources.campaign.tabs.metadata">
        <TextInput
          source="label"
          label="resources.campaign.fields.label"
          formClassName={classes.inline}
        />
        <DateInput
          source="start_date"
          label="resources.campaign.fields.start_date"
          formClassName={classes.inline}
        />

        {edit && (
          <SelectField source="state" choices={stateChoices} formClassName={classes.inline} />
        )}
        <Br />

        {hasPermission('can_manage_users') && (
          <ReferenceInput
            label="resources.campaign.fields.assignee"
            source="assignee"
            reference={RES_USER}
          >
            <SelectInput optionText="email" />
          </ReferenceInput>
        )}

        <Br />

        <ViewpointGrid />
      </FormTab>
    </TabbedForm>
  );
};

PictureFields.propTypes = {
  edit: PropTypes.bool,
};

PictureFields.defaultProps = {
  edit: false,
};

export default compose(withMapConfig, withStyles(styles))(PictureFields);
