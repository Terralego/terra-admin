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
  }

  componentDidMount () {
    this.dataLoaded();
  }

  componentDidUpdate ({ source: prevSource }) {
    const { source } = this.props;
    if (prevSource !== source) {
      this.dataLoaded();
    }
  }

  dataLoaded = () => {
    const { map, source } = this.props;
    if (!map) {
      setTimeout(() => this.dataLoaded(), 500);
      return;
    }
    const listener = ({ isSourceLoaded }) => {
      if (isSourceLoaded) {
        this.setState(() => {
          const readerFeatures = map.queryRenderedFeatures();
          const features = readerFeatures.filter(({ sourceLayer }) => sourceLayer === source);
          const { data, columns } = features.reduce((list, feature, index) => (
            {
              data: [...list.data, Object.values(feature.properties)],
              columns: !index ? list.columns : Object.keys(feature.properties),
            }
          ), { data: [], columns: [] });
          return { data, columns };
        });
        map.off('sourcedata', listener);
      }
    };
    map.on('sourcedata', listener);
  }

  resize = () => this.setState(({ full }) => {
    const delay = !full ? 0 : 1000;
    setTimeout(() => this.setState({ full: !full, isResizing: false }), delay);

    return { isResizing: true };
  })

  render () {
    const { map, source, t } = this.props;
    const { data, columns, isResizing, full } = this.state;
    const hasData = data.length;

    if (!map) return null;

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
          loading={!hasData}
        />
      </div>
    );
  }
}

export default withNamespaces()(DataTable);
