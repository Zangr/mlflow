import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUUID } from '../../Actions';
import {
  enableServingApi,
  getEndpointStatusApi,
  listEndpointVersionsApi,
  listEndpointVersionAliasesApi,
  disableServingApi,
  getEndpointVersionLogsApi,
  submitServingRequestApi,
  getEndpointEventHistoryApi,
  getEndpointMetricHistoryApi,
} from '../actions';
import Utils from '../../utils/Utils';
import { getServingModelKey } from '../utils';
import { ServingView } from './ServingView';
import RequestStateWrapper from '../../components/RequestStateWrapper';
import { Spinner } from '../../components/Spinner';

const SERVING_STATUS_POLL_INTERVAL = 10000;

class ServingPane extends React.Component {
  static propTypes = {
    modelName: PropTypes.string.isRequired,
    endpoint: PropTypes.object,
    endpointVersions: PropTypes.array,
    aliases: PropTypes.array,

    enableServingApi: PropTypes.func.isRequired,
    getEndpointStatusApi: PropTypes.func.isRequired,
    listEndpointVersionsApi: PropTypes.func.isRequired,
    disableServingApi: PropTypes.func.isRequired,
    getEndpointVersionLogsApi: PropTypes.func.isRequired,
    listEndpointVersionAliasesApi: PropTypes.func.isRequired,
    submitServingRequestApi: PropTypes.func.isRequired,
    getEndpointEventHistoryApi: PropTypes.func.isRequired,
    getEndpointMetricHistoryApi: PropTypes.func.isRequired,
  };

  enableServingApiId = getUUID();
  disableServingApiId = getUUID();
  getEndpointStatusApiId = getUUID();
  listEndpointVersionsApiId = getUUID();
  listEndpointVersionAliasesApiId = getUUID();
  getEndpointVersionLogsApiId = getUUID();
  submitServingRequestApiId = getUUID();

  initialGetEndpointStatusApiId = getUUID();
  initialListEndpointVersionsApiId = getUUID();

  criticalInitialRequestIds = [
    this.initialGetEndpointStatusApiId,
    this.initialListEndpointVersionsApiId,
  ];

  handleEnableServing = (onComplete) => {
    const { modelName } = this.props;
    return this.props
      .enableServingApi(
        null,
        modelName,
        this.enableServingApiId,
      )
      .then(this.loadServingState)
      .then(onComplete)
      .catch(Utils.logErrorAndNotifyUser);
  };

  handleDisableServing = (onComplete) => {
    const { modelName } = this.props;
    return this.props
      .disableServingApi(
        null,
        modelName,
        this.disableServingApiId,
      )
      .then(this.loadServingState)
      .then(onComplete)
      .catch(Utils.logErrorAndNotifyUser);
  };

  handleSelectEndpointVersion = (endpointVersionName, logsCallback) => {
    const { modelName } = this.props;
    return this.props
      .getEndpointVersionLogsApi(
        null,
        modelName,
        endpointVersionName,
        this.getEndpointVersionLogsApiId,
      )
      .then(logsCallback)
      .catch(Utils.logErrorAndNotifyUser);
  };

  handleServingRequest = (endpointVersionName, requestPayload, callback, errorCallback) => {
    const { modelName } = this.props;
    return this.props
      .submitServingRequestApi(
        "mlflow-model-" + modelName, // cluster name...
        endpointVersionName, // version id...
        requestPayload,
        this.submitServingRequestApiId,
      )
      .then(callback)
      .catch(errorCallback)
      .catch(this.suppressInvalidParameterValue)
      .catch(Utils.logErrorAndNotifyUser);
  };

  // Certain APIs return INVALID_PARAMETER_VALUE if the target object is not valid
  // (e.g., if the model is not being served). This situation is perfectly fine,
  // so do not throw an exception.
  // If the error does not match, this will re-throw the original exception.
  suppressInvalidParameterValue = (e) => {
    if (e.xhr !== undefined
        && e.xhr.status === 400
        && e.getErrorCode !== undefined
        && e.getErrorCode() === "INVALID_PARAMETER_VALUE") {
      return;
    }
    throw e;
  }

  loadServingState = (initialLoad) => {
    const { modelName } = this.props;
    const getEndpointId = initialLoad ?
      this.initialGetEndpointStatusApiId : this.getEndpointStatusApiId;
    this.props.getEndpointStatusApi(null, modelName, getEndpointId)
      .catch(this.suppressInvalidParameterValue)
      .catch(Utils.logErrorAndNotifyUser);

    const listVersionsId = initialLoad ?
      this.initialListEndpointVersionsApiId : this.listEndpointVersionsApiId;
    this.props.listEndpointVersionsApi(null, modelName, listVersionsId)
      .catch(this.suppressInvalidParameterValue)
      .catch(Utils.logErrorAndNotifyUser);

    this.props.listEndpointVersionAliasesApi(null, modelName,
          this.listEndpointVersionAliasesApiId)
        .catch(this.suppressInvalidParameterValue)
        .catch(Utils.logErrorAndNotifyUser);
  };

  componentDidMount() {
    this.loadServingState(true);
  }

  componentDidUpdate() {
    const { endpoint } = this.props;
    if (endpoint && !this.pollServingStatusIntervalId) {
      this.pollServingStatusIntervalId =
        setInterval(this.loadServingState, SERVING_STATUS_POLL_INTERVAL);
    } else if (!endpoint) {
      clearInterval(this.pollServingStatusIntervalId);
      this.pollServingStatusIntervalId = null;
    }
  }

  render() {
    const { modelName, endpoint, endpointVersions, aliases } = this.props;
    return (
      <RequestStateWrapper requestIds={this.criticalInitialRequestIds} shouldOptimisticallyRender>
        {(loading) => {
          if (loading) {
            return (
              <div className='serving-spinner'>
                <Spinner />
              </div>
            );
          } else {
            return (
              <ServingView
                modelName={modelName}
                aliases={aliases}
                endpoint={endpoint}
                endpointVersions={endpointVersions}
                handleEnableServing={this.handleEnableServing}
                handleDisableServing={this.handleDisableServing}
                handleSelectEndpointVersion={this.handleSelectEndpointVersion}
                handleServingRequest={this.handleServingRequest}
              />
            );
          }
        }}
      </RequestStateWrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { modelName } = ownProps;

  const servingModelKey = getServingModelKey(null, modelName);
  const endpoint = state.entities.endpointStatus[servingModelKey];
  const endpointVersions = state.entities.endpointVersionStatus[servingModelKey];
  const aliases = state.entities.endpointAliases[servingModelKey];

  return {
    modelName,
    endpoint,
    endpointVersions,
    aliases,
  };
};

const mapDispatchToProps = {
  enableServingApi,
  getEndpointStatusApi,
  listEndpointVersionsApi,
  listEndpointVersionAliasesApi,
  disableServingApi,
  getEndpointVersionLogsApi,
  submitServingRequestApi,
  getEndpointEventHistoryApi,
  getEndpointMetricHistoryApi,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServingPane);
