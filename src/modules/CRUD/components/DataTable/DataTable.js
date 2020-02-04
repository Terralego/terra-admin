import React from 'react';
import Table from '@terralego/core/modules/Table';

import { getView } from '../../services/CRUD';
import Header from './Header';
import CellRender from './CellRender';
import Footer from './Footer';
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

  loadData = tableFilters => {
    const { getFeaturesList, tableFilters: prevTableFilters, setTableFilters } = this.props;
    const { featureEndpoint } = this.getView();
    if (!featureEndpoint) return;
    const filters = tableFilters || prevTableFilters;
    getFeaturesList(featureEndpoint, filters);
    setTableFilters(filters);
    this.setState({
      data: [],
      loading: true,
      columnWidths: LOADING_COLUMN_WIDTHS,
    });
  }

  setData = () => {
    const { featuresList: { results = [] } = {}, layerName: layer } = this.props;
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

    const data = results.map(({ properties: props }) => columns.map(({ value }) => `${props[value] || ''}`));
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

  onPageChange = ({ selected = 0, nextPageSize } = {}) => {
    const { tableFilters } = this.props;
    this.loadData({
      ...tableFilters,
      page_size: nextPageSize || tableFilters.page_size,
      page: selected + 1,
    });
  };

  onSort = ({ columnIndex, order }) => {
    const { columns } = this.state;

    const {
      tableFilters: prevTableFilters,
    } = this.props;

    if (!columns.length) {
      return;
    }

    const [prevColumns = columns, nextColumns = columns] = this.columnsToCompare;

    const displayed = ({ display }) => display === true;
    const prevColumnsDisplayed = prevColumns.filter(displayed);
    const columnsDisplayed = nextColumns.filter(displayed);

    this.columnsToCompare = [nextColumns, nextColumns];

    if (prevColumnsDisplayed.length !== columnsDisplayed.length) {
      return;
    }

    const prefix = order === 'asc' ? '' : '-';
    const suffix = columnsDisplayed[columnIndex].value;

    const tableFilters = {
      ...prevTableFilters,
      page_size: prevTableFilters.page_size || 10,
      ordering: `${prefix}properties__${suffix}`,
      page: 1,
    };

    if (JSON.stringify(prevTableFilters) === JSON.stringify(tableFilters)) {
      return;
    }

    this.loadData(tableFilters);
  }

  render () {
    const {
      t,
      featuresList,
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
                  onHeaderChange={this.onHeaderChange}
                  layerName={displayName}
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
              />
              <p>{t('CRUD.table.noFeature')}</p>
            </div>
          )}
        <Footer
          featuresList={featuresList}
          onPageChange={this.onPageChange}
          onPaginationSizeChange={this.onPaginationSizeChange}
        />
      </div>
    );
  }
}

export default DataTable;
