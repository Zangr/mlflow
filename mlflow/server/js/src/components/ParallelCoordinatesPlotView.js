import React from 'react';
import { connect } from 'react-redux';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

export class ParallelCoordinatesPlotView extends React.Component {
  static propTypes = {
    runUuids: PropTypes.arrayOf(String).isRequired,
    paramKeys: PropTypes.arrayOf(String).isRequired,
    metricKeys: PropTypes.arrayOf(String).isRequired,
    paramDimensions: PropTypes.arrayOf(Object).isRequired,
    metricDimensions: PropTypes.arrayOf(Object).isRequired,
  };

  getData() {
    const { paramDimensions, metricDimensions } = this.props;
    return [
      {
        type: 'parcoords',
        line: {
          showscale: true,
          reversescale: true,
          colorscale: 'Jet',
          cmin: -4000,
          cmax: -100,
          color: 1000,
        },
        dimensions: [...paramDimensions, ...metricDimensions],
      },
    ];
  };

  render() {
    return (
      <Plot
        layout={{ autosize: true }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        data={this.getData()}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { runUuids, paramKeys, metricKeys } = ownProps;
  const { latestMetricsByRunUuid, paramsByRunUuid } = state.entities;
  const paramDimensions = paramKeys.map((paramKey) => ({
    label: paramKey,
    values: runUuids.map((runUuid) => paramsByRunUuid[runUuid][paramKey].value),
  }));
  const metricDimensions = metricKeys.map((metricKey) => ({
    label: metricKey,
    values: runUuids.map((runUuid) => latestMetricsByRunUuid[runUuid][metricKey].value),
  }));
  return { paramDimensions, metricDimensions };
};

export default connect(mapStateToProps)(ParallelCoordinatesPlotView);
