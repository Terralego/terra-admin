import React from 'react';
import Table from 'mc-tf-test/modules/Table';
import classnames from 'classnames';
import { withNamespaces } from 'react-i18next';

import Header from './Header';

class DataTable extends React.Component {
  state = {
    data: [],
    columns: [],
    full: false,
    isResizing: false,
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

  getLayerBySource () {
    const { source, layersList } = this.props;
    return layersList.find(({ name }) => name === source);
  }

  loadData = () => {
    const { getFeaturesList } = this.props;
    const layer = this.getLayerBySource();
    if (!layer) return;
    this.setState({
      loading: true,
    });
    getFeaturesList(layer.id);
  }

  setData = () => {
    const { featuresList } = this.props;
    const { schema: { properties } } = this.getLayerBySource();
    const columns = Object.keys(properties).map(value => ({
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

  resize = () => this.setState(({ full }) => {
    const delay = !full ? 0 : 1000;
    setTimeout(() => this.setState({ full: !full, isResizing: false }), delay);

    return { isResizing: true };
  })

  render () {
    const { source, t } = this.props;
    const { data, columns, isResizing, full, loading } = this.state;

    return (
      <div
        className={classnames(
          'table-container',
          { 'table-container--full': full },
          { 'table-container--is-resizing': isResizing },
        )}
      >
        <Table
          columns={columns}
          data={data}
          Header={() => (
            <Header source={source} full={full} resize={this.resize} />
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
