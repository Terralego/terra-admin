import React from 'react';
import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import {
  ReferenceField,
  FunctionField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';
import { RES_USER, RES_DATALAYER } from '../../ra-modules';

const useStyle = makeStyles({
  layers: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const GeneralInfoTab = ({
  translate,
  record: {
    created_at: createdAt,
    updated_at: updatedAt,
    description,
    credit,
    author,
  },
}) => {
  const classes = useStyle();
  return (
    <List>
      <ListItem>
        <ListItemText
          primary={translate('datasource.form.infos.created')}
          secondary={new Date(createdAt).toLocaleString()}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={translate('datasource.form.infos.updated')}
          secondary={new Date(updatedAt).toLocaleString()}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={translate('datasource.form.infos.description')}
          secondary={description || translate('datasource.form.infos.no-description')}
        />
      </ListItem>
      <ListItem>
        <ListItemText
          primary={translate('datasource.form.infos.credit')}
          secondary={credit || translate('datasource.form.infos.no-credit')}
        />
      </ListItem>
      <ListItem>
        {author
          ? (
            <ReferenceField source="author" reference={RES_USER}>
              <FunctionField
                render={({ email }) => (
                  <ListItemText
                    primary={translate('datasource.form.infos.author')}
                    secondary={email}
                  />
                )}
              />
            </ReferenceField>
          ) : (
            <ListItemText
              primary={translate('datasource.form.infos.author')}
              secondary={translate('datasource.form.infos.no-author')}
            />
          )}
      </ListItem>
      <ListItem className={classes.layers}>
        <ListItemText primary={translate('datasource.form.layers')} />
        <ReferenceArrayField source="layers" reference={RES_DATALAYER}>
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
      </ListItem>
    </List>
  );
};

export default GeneralInfoTab;
