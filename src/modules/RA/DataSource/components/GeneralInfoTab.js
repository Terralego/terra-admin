import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { ReferenceField, FunctionField } from 'react-admin';
import { RES_USER } from '../../ra-modules';


const GeneralInfoTab = ({
  translate,
  record: {
    created_at: createdAt,
    updated_at: updatedAt,
    description,
    credit,
    author,
  },
}) => (
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
  </List>
);

export default GeneralInfoTab;
