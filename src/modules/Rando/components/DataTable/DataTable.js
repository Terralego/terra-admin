import React from 'react';
import Table from '@terralego/core/modules/Table';
import classnames from 'classnames';
import { withNamespaces } from 'react-i18next';

import Header from './Header';

class DataTable extends React.Component {
  state = {
    data: [],
    columns: [],
    loading: false,
  }

  componentDidMount () {
    this.loadData();
  }

  componentDidUpdate ({ source: prevSource, featuresList: prevFeaturesList }) {
    const { source, featuresList } = this.props;
    if (prevSource !== source) {
      this.cleanData();
      this.loadData();
    }
    if (featuresList && prevFeaturesList !== featuresList) {
      this.setData();
    }
  }

  loadData = () => {
    this.setState({
      loading: true,
    });
  }

  setData = () => {
    const {
      featuresList,
      layer: {
        schema: { properties = {} },
        settings: { properties: { default_list: defaultList = false } = {} },
      },
    } = this.props;
    const columns = Object.keys(properties).map(value => ({
      display: !defaultList || defaultList.includes(value),
      sortable: true,
      ...properties[value],
      value,
      label: properties[value].title,
      format: {
        type: properties[value].type,
      },
    }));

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

  resize = (tableSize = 'medium') => {
    const { onTableSizeChange } = this.props;
    onTableSizeChange(tableSize);
  }

  render () {
    const { source, t, tableSize } = this.props;
    const { data, columns, loading } = this.state;
    return (
      <div
        className={classnames(
          'table-container',
          { [`table-container--${tableSize}`]: tableSize },
        )}
      >
        <Table
          columns={columns}
          data={data}
          Header={props => (
            <Header
              {...props}
              source={source}
              tableSize={tableSize}
              resize={this.resize}
            />
          )}
          locales={{
            sortAsc: t('rando.table.sortAsc'),
            sortDesc: t('rando.table.sortDesc'),
          }}
          loading={loading}
        />
      </div>
    );
  }
}

export default withNamespaces()(DataTable);
