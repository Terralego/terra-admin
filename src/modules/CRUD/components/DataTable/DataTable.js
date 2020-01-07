import React from 'react';
import Table from '@terralego/core/modules/Table';
import { withNamespaces } from 'react-i18next';

import { getView } from '../../services/CRUD';
import Header from './Header';
import CellRender from './CellRender';
import './styles.scss';

const LOADING_COLUMN_WIDTHS = Array.from({ length: 10 }, () => 250);

class DataTable extends React.Component {
  state = {
    data: [],
    columns: [],
    loading: true,
    layer: undefined,
    initialSort: {
      columnIndex: 0,
      order: 'asc',
    },
    columnWidths: LOADING_COLUMN_WIDTHS,
    querystring: {},
  }

  tableRef = React.createRef();

  columnsToCompare = [undefined, undefined];

  componentDidMount () {
    this.loadData();
  }

  componentDidUpdate ({ layerName: prevLayerName, featuresList: prevFeaturesList }) {
    const { layerName, featuresList } = this.props;
    if (prevLayerName !== layerName) {
      this.loadData();
      this.columnsToCompare = [undefined, undefined];
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
      data: [],
      loading: true,
      columnWidths: LOADING_COLUMN_WIDTHS,
      querystring,
    });
  }

  setData = () => {
    const { featuresList = [], layerName: layer } = this.props;
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

    const [, nextColumns = columns] = this.columnsToCompare;

    const data = featuresList.map(({ properties: props }) => columns.map(({ value }) => `${props[value] || ''}`));
    const displayedColumns = columns.filter(({ display }) => display === true);
    const { current } = this.tableRef;
    const columnWidth = (!columns.length && !current)
      ? 250
      : (current.offsetWidth - 50) / displayedColumns.length;

    this.setState({
      layer,
      columns: nextColumns,
      data,
      loading: false,
      columnWidths: displayedColumns.map(() => columnWidth),
    });

    this.columnsToCompare = [nextColumns, nextColumns];
  }

  getView = () => {
    const { settings, layerName } = this.props;
    return getView(settings, layerName);
  }


  resize = (tableSize = 'medium') => {
    const { onTableSizeChange } = this.props;
    onTableSizeChange(tableSize);
  }

  onHeaderChange = ({ index } = {}) => {
    if (index === undefined) {
      return;
    }
    const { columns } = this.state;
    const [prevColumns = columns, nextColumns = columns] = this.columnsToCompare;
    // eslint-disable-next-line no-multi-assign
    nextColumns[index].display = !nextColumns[index].display;
    this.columnsToCompare = [prevColumns, nextColumns];
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

    const displayed = ({ display }) => display === true;
    const prevColumnsDisplayed = prevColumns.filter(displayed);
    const columnsDisplayed = nextColumns.filter(displayed);

    if (prevColumnsDisplayed.length !== columnsDisplayed.length) {
      this.columnsToCompare = [nextColumns, nextColumns];
      return;
    }

    this.columnsToCompare = [nextColumns, nextColumns];

    const prefix = order === 'asc' ? '' : '-';
    const suffix = columnsDisplayed[columnIndex].value;

    const querystring = {
      ordering: `${prefix}properties__${suffix}`,
      page_size: 2000,
    };

    if (JSON.stringify(prevQuerystring) === JSON.stringify(querystring)) {
      return;
    }

    this.loadData(querystring);
  }

  render () {
    const {
      t,
      tableSize,
      featuresList = [],
      onHoverCell = () => null,
    } = this.props;

    const { layer: { name } = {}, name: displayName = name } = this.getView();

    const { data, columns, loading, initialSort, columnWidths, layer } = this.state;

    return (
      <div className="table-container" ref={this.tableRef}>
        {loading || columns.length
          ? (
            <Table
              columns={columns}
              data={data}
              columnWidths={columnWidths}
              Header={props => (
                <Header
                  {...props}
                  layerName={displayName}
                  tableSize={tableSize}
                  resize={this.resize}
                  loading={loading}
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
                  layer={layer}
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
