import React from 'react';
import Table from '@terralego/core/modules/Table';
import { withNamespaces } from 'react-i18next';

import { getView } from '../../services/CRUD';
import Header from './Header';
import CellRender from './CellRender';
import './styles.scss';

class DataTable extends React.Component {
  state = {
    data: [],
    columns: [],
    loading: false,
    initialSort: {
      columnIndex: 0,
      order: 'asc',
    },
  }


  componentDidMount () {
    this.loadData();
  }

  componentDidUpdate ({ layerName: prevLayerName, featuresList: prevFeaturesList }) {
    const { layerName, featuresList } = this.props;
    if (prevLayerName !== layerName) {
      this.cleanData();
      this.loadData();
    }
    if (featuresList && prevFeaturesList !== featuresList) {
      this.setData();
    }
  }

  loadData = (querystring = { page_size: 2000 }) => {
    const { getFeaturesList } = this.props;
    const { featureEndpoint } = this.getView();
    if (!featureEndpoint) return;
    getFeaturesList(featureEndpoint, querystring);
    this.setState({
      loading: true,
    });
  }

  setData = () => {
    const { featuresList = [] } = this.props;
    const { featureListProperties } = this.getView();

    const columns = Object.keys(featureListProperties).map(value => {
      const { selected = false, title, type } = featureListProperties[value] || {};
      return {
        display: selected,
        sortable: true,
        value,
        label: title,
        format_type: type,
      };
    });

    const data = featuresList.map(({ properties: props }) => columns.map(({ value }) => `${props[value] || ''}`));
    this.setState({
      columns,
      data,
      loading: false,
    });
  }

  cleanData = () => {
    this.setState({
      data: [],
    });
  }

  getView = () => {
    const { settings, layerName } = this.props;
    return getView(settings, layerName);
  }


  resize = (tableSize = 'medium') => {
    const { onTableSizeChange } = this.props;
    onTableSizeChange(tableSize);
  }

  render () {
    const {
      layerName,
      t,
      tableSize,
      featuresList = [],
      onHoverCell = () => null,
    } = this.props;

    const { layer: { name } = {}, name: displayName = name } = this.getView();

    const { data, columns, loading, initialSort } = this.state;

    return (
      <div className="table-container">
        {loading || data.length
          ? (
            <Table
              columns={columns}
              data={data}
              Header={props => (
                <Header
                  {...props}
                  layerName={displayName}
                  tableSize={tableSize}
                  resize={this.resize}
                  loading={loading}
                />
              )}
              locales={{
                sortAsc: t('CRUD.table.sortAsc'),
                sortDesc: t('CRUD.table.sortDesc'),
              }}
              loading={loading}
              initialSort={initialSort}
              onSort={this.onSort}
              renderCell={props => (
                <CellRender
                  featuresList={featuresList}
                  layer={layerName}
                  onHoverCell={onHoverCell}
                  {...props}
                />
              )}
            />
          )
          : (
            <div>
              <Header
                columns={[]}
                layerName={displayName}
                tableSize={tableSize}
                resize={this.resize}
              />
              <p>{t('CRUD.table.noFeature')}</p>
            </div>
          )}
      </div>
    );
  }
}

export default withNamespaces()(DataTable);
