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
    querystring: {},
  }

  columnsToCompare = [undefined, undefined];

  componentDidMount () {
    this.loadData();
  }

  componentDidUpdate ({ layerName: prevLayerName, featuresList: prevFeaturesList }) {
    const { layerName, featuresList } = this.props;
    if (prevLayerName !== layerName) {
      this.cleanData();
      this.loadData();
      this.columnsToCompare = [undefined, undefined];
    }
    if (featuresList && prevFeaturesList !== featuresList) {
      this.setData();
    }
  }

  loadData = (querystring = {}) => {
    const { getFeaturesList } = this.props;
    const { featureEndpoint } = this.getView();
    if (!featureEndpoint) return;
    getFeaturesList(featureEndpoint, querystring);
    this.setState({
      loading: true,
      querystring,
    });
  }

  setData = () => {
    const { featuresList = [] } = this.props;
    const { featureListProperties } = this.getView();

    const columns = Object.keys(featureListProperties).map(value => {
      const { selected, title, type } = featureListProperties[value];
      return {
        display: selected,
        sortable: true,
        value,
        label: title,
        format: {
          type,
        },
      };
    });

    const [, nextColumns = columns] = this.columnsToCompare;

    const data = featuresList.map(({ properties: props }) => columns.map(({ value }) => `${props[value] || ''}`));
    this.setState({
      columns: nextColumns,
      data,
      loading: false,
    });

    this.columnsToCompare = [nextColumns, nextColumns];
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

  onHeaderChange = ({ index } = {}) => {
    if (index === undefined) {
      return;
    }
    const { columns } = this.state;
    const [prevColumns = columns, nextColumns = columns] = this.columnsToCompare;
    const cols = nextColumns.map((col, i) => (
      (i === index)
        ? { ...col, display: !col.display }
        : col
    ));
    this.columnsToCompare = [prevColumns, cols];
  }

  onSort = ({ columnIndex, order }) => {
    const {
      querystring: prevQuerystring = {},
      columns,
    } = this.state;

    if (!columns.length) {
      return;
    }

    const [prevColumns = columns, nextColumns = columns] = this.columnsToCompare;

    const prevColumnsDisplayed = prevColumns.filter(({ display }) => display === true);
    const columnsDisplayed = nextColumns.filter(({ display }) => display === true);


    if (prevColumnsDisplayed.length !== columnsDisplayed.length) {
      this.columnsToCompare = [nextColumns, nextColumns];
      return;
    }

    this.columnsToCompare = [nextColumns, nextColumns];

    const querystring = {
      ordering: `${order === 'asc' ? '' : '-'}properties__${columnsDisplayed[columnIndex].value}`,
      page_size: 2000,
    };

    if (JSON.stringify(prevQuerystring) === JSON.stringify(querystring)) {
      return;
    }

    this.loadData(querystring);
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
                  onHeaderChange={this.onHeaderChange}
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
