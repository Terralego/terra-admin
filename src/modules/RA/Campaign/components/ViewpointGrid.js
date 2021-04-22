import React from 'react';

import { TextField, Datagrid, useGetMany, CreateButton, ShowButton, useTranslate } from 'react-admin';

import Api from '@terralego/core/modules/Api';

import { useHistory } from 'react-router';
import { useField } from 'react-final-form';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { RES_PICTURE } from '../../ra-modules';
import useUserSettings from '../../../../hooks/useUserSettings';

import AddViewpoint from './AddViewpoint';
import CampaignPictureState from './CampaignPictureState';

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

const PictureAction = ({ record: viewpoint, campaign, pictureMap }) => {
  const { hasPermission } = useUserSettings();

  const { location } = useHistory();
  if (pictureMap[viewpoint.id]) {
    return (
      <ShowButton
        basePath="/picture"
        label="resources.campaign.actions.show_picture"
        to={{
          pathname: `/${RES_PICTURE}/${pictureMap[viewpoint.id].id}`,
          state: {
            redirect: location.pathname,
          },
        }}
      />
    );
  }
  if (!hasPermission('can_manage_campaigns') && campaign.state === 'started') {
    return (
      <CreateButton
        basePath="/picture"
        label="resources.campaign.actions.add_picture"
        to={{
          pathname: `/${RES_PICTURE}/create`,
          state: {
            record: { viewpoint: viewpoint.id, campaign: campaign.id },
            redirect: location.pathname,
          },
        }}
      />
    );
  }
  return null;
};

const ViewpointSheet = ({ record: viewpoint }) => {
  const translate = useTranslate();
  return (
    <a href={`${Api.host}/viewpoints/${viewpoint.id}/pdf/`} download={`${translate('resources.campaign.fields.sheet_filename_prefix')}_${viewpoint.id}.pdf`}>
      {translate('resources.campaign.fields.download_sheet')}
    </a>
  );
};

const RemoveViewpoint = ({ record: viewpoint, onRemove, pictureMap }) => {
  if (pictureMap[viewpoint.id]) {
    return null;
  }
  return (
    <IconButton color="secondary" variant="contained" onClick={() => onRemove(viewpoint.id)}>
      <DeleteIcon />
    </IconButton>
  );
};

const postRowStyle = pictureMap => ({ id }) => {
  let state = 'missing';

  if (pictureMap[id]) {
    state = pictureMap[id].state;
  }

  switch (state) {
    case 'submited':
      return {
        borderLeft: '4px solid orange',
      };
    case 'accepted':
      return {
        borderLeft: '4px solid green',
      };
    case 'refused':
      return {
        borderLeft: '4px solid red',
      };
    default: {
      return {};
    }
  }
};


const ViewpointGrid = ({ record }) => {
  const { hasPermission } = useUserSettings();

  const {
    input: { value: viewpoints = [], onChange },
  } = useField('viewpoints', { defaultValue });

  const {
    input: { value: state },
  } = useField('state');

  const { data: viewpointsData, total, loaded } = useGetMany('viewpoint', viewpoints);
  const [currentSort, setCurrentSort] = React.useState({ field: 'id', order: 'DESC' });

  // Compute picture map to easily associate viewpoint to picture
  const pictureMap = React.useMemo(() => {
    if (!record.pictures) {
      return [];
    }
    return record.pictures.reduce((acc, pic) => {
      acc[pic.viewpoint] = pic;
      return acc;
    }, {});
  }, [record.pictures]);

  // Compute picture state from map for viewpoint
  const getPictureState = React.useCallback(viewpoint => {
    if (pictureMap[viewpoint.id]) {
      switch (pictureMap[viewpoint.id].state) {
        case 'submited':
        case 'accepted':
        case 'refused':
          return pictureMap[viewpoint.id].state;
        case 'draft':
          if (hasPermission('can_add_pictures')) {
            return 'draft';
          }
          break;
        default:
          break;
      }
    }
    return 'missing';
  }, [hasPermission, pictureMap]);

  // Add picture state field
  const data = React.useMemo(() => viewpointsData.map(
    viewpoint => viewpoint && { ...viewpoint, picture_state: getPictureState(viewpoint) },
  ), [getPictureState, viewpointsData]);


  // Viewpoint map for data grid
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

  const handleRemove = React.useCallback(
    idToBeRemoved => {
      const newViewpoints = viewpoints.filter(id => id !== idToBeRemoved);
      onChange(newViewpoints);
    },
    [onChange, viewpoints],
  );

  const postRowStyleCallback = React.useCallback(postRowStyle(pictureMap), [pictureMap]);

  return (
    <>
      <Datagrid
        basePath=""
        rowStyle={postRowStyleCallback}
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
        <TextField source="id" label="resources.viewpoint.fields.id" />
        <TextField source="label" label="resources.viewpoint.fields.label" />
        <ViewpointSheet label="resources.viewpoint.fields.replay_sheet" />
        <CampaignPictureState
          source="picture_state" // not used but allow ordering in header
          label="resources.viewpoint.fields.picture_state"
          pictureMap={pictureMap}
        />
        <PictureAction campaign={record} pictureMap={pictureMap} />
        <RemoveViewpoint onRemove={handleRemove} pictureMap={pictureMap} />
      </Datagrid>
      {hasPermission('can_manage_campaigns') && state === 'draft' && (
        <AddViewpoint textContent={{}} ids={viewpoints} onAdd={onAdd} />
      )}
    </>
  );
};

export default ViewpointGrid;
