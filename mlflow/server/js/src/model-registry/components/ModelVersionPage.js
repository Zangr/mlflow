import React from 'react';
import { connect } from 'react-redux';
import {
  getModelVersionActivitiesApi,
  getModelVersionApi,
  createTransitionRequestApi,
  listTransitionRequestsApi,
  approveTransitionRequestApi,
  rejectTransitionRequestApi,
  deleteTransitionRequestApi,
  updateModelVersionApi,
  deleteModelVersionApi,
  transitionModelVersionStageApi,
} from '../actions';
import { getRunApi, getUUID } from '../../Actions';
import PropTypes from 'prop-types';
import {
  getModelVersionActivities,
  getModelVersion,
  getModelVersionTransitionRequests,
} from '../reducers';
import { ModelVersionView } from './ModelVersionView';
import { ActivityTypes, MODEL_VERSION_STATUS_POLL_INTERVAL as POLL_INTERVAL} from '../constants';
import Utils from '../../utils/Utils';
import { getRunInfo, getRunTags } from '../../reducers/Reducers';
import RequestStateWrapper, { triggerError } from '../../components/RequestStateWrapper';
import { shouldRender404 } from '../../common/utils';
import { Error404View } from '../../common/components/Error404View';
import { Spinner } from '../../components/Spinner';
import { modelListPageRoute } from '../routes';

class ModelVersionPage extends React.Component {
  static propTypes = {
    // own props
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    // connected props
    modelName: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    modelVersion: PropTypes.object,
    activities: PropTypes.arrayOf(Object),
    transitionRequests: PropTypes.arrayOf(Object),
    runInfo: PropTypes.object,
    runDisplayName: PropTypes.string,
    getModelVersionActivitiesApi: PropTypes.func.isRequired,
    getModelVersionApi: PropTypes.func.isRequired,
    updateModelVersionApi: PropTypes.func.isRequired,
    transitionModelVersionStageApi: PropTypes.func.isRequired,
    listTransitionRequestsApi: PropTypes.func.isRequired,
    createTransitionRequestApi: PropTypes.func.isRequired,
    approveTransitionRequestApi: PropTypes.func.isRequired,
    rejectTransitionRequestApi: PropTypes.func.isRequired,
    deleteTransitionRequestApi: PropTypes.func.isRequired,
    deleteModelVersionApi: PropTypes.func.isRequired,
    getRunApi: PropTypes.func.isRequired,
    apis: PropTypes.object.isRequired,
  };

  initListTransitionRequestId = getUUID();
  initGetActivitiesRequestId = getUUID();
  initGetModelVersionDetailsRequestId = getUUID();
  getRunRequestId = getUUID();
  listTransitionRequestId = getUUID();
  getActivitiesRequestId = getUUID();
  updateModelVersionRequestId = getUUID();
  transitionModelVersionStageRequestId = getUUID();
  approveTransitionRequestId = getUUID();
  rejectTransitionRequestId = getUUID();
  deleteTransitionRequestId = getUUID();
  getModelVersionDetailsRequestId = getUUID();

  criticalInitialRequestIds = [
    this.initListTransitionRequestId,
    this.initGetActivitiesRequestId,
    this.initGetModelVersionDetailsRequestId,
  ];

  loadData = (isInitialLoading) => {
    const { modelName, version } = this.props;
    return Promise.all([
      this.getModelVersionDetailAndRunInfo(isInitialLoading),
      this.props.listTransitionRequestsApi(
        modelName,
        version,
        isInitialLoading === true
          ? this.initListTransitionRequestId
          : this.listTransitionRequestId
      ),
      this.props.getModelVersionActivitiesApi(
        modelName,
        version,
        isInitialLoading === true ? this.initGetActivitiesRequestId : this.getActivitiesRequestId,
      ),
    ]).catch(console.error);
  };

  // We need to do this because currently the ModelVersionDetailed we got does not contain
  // experimentId. We need experimentId to construct a link to the source run. This workaround can
  // be removed after the availability of experimentId.
  getModelVersionDetailAndRunInfo(isInitialLoading) {
    const { modelName, version } = this.props;
    return this.props
      .getModelVersionApi(
        modelName,
        version,
        isInitialLoading === true
          ? this.initGetModelVersionDetailsRequestId
          : this.getModelVersionDetailsRequestId,
      )
      .then(({ value }) => {
        if (value) {
          this.props.getRunApi(
            value.model_version_databricks.run_id,
            this.getRunRequestId,
          );
        }
      });
  }

  handleStageTransitionDropdownSelect = (activity, comment) => {
    const { modelName, version } = this.props;
    const toStage = activity.to_stage;
    if (activity.type === ActivityTypes.REQUESTED_TRANSITION) {
      this.props
        .createTransitionRequestApi(modelName, version, toStage, comment)
        .then(this.loadData)
        .catch(console.error);
    } else if (activity.type === ActivityTypes.APPLIED_TRANSITION) {
      this.props
        .transitionModelVersionStageApi(
          modelName,
          version,
          toStage,
          false,  // TODO(andy.chow): once we have a dialog calling this we can pass in this param
          comment,
          this.transitionModelVersionStageRequestId,
        )
        .then(this.loadData)
        .catch(console.error);
    }
  };

  handlePendingRequestApproval = (pendingRequest, archiveExistingVersions, comment) => {
    const { modelName, version } = this.props;
    this.props
      .approveTransitionRequestApi(
        modelName,
        version,
        pendingRequest.to_stage,
        archiveExistingVersions,
        comment,
        this.approveTransitionRequestId,
      )
      .then(this.loadData)
      .catch(console.error);
  };

  handlePendingRequestRejection = (pendingRequest, comment) => {
    const { modelName, version } = this.props;
    this.props
      .rejectTransitionRequestApi(
        modelName,
        version,
        pendingRequest.to_stage,
        comment,
        this.rejectTransitionRequestId,
      )
      .then(this.loadData)
      .catch(console.error);
  };

  handlePendingRequestDeletion = (pendingRequest, comment) => {
    const { modelName, version } = this.props;
    this.props
      .deleteTransitionRequestApi(
        modelName,
        version,
        comment,
        pendingRequest.user_id,
        pendingRequest.to_stage,
        this.deleteTransitionRequestId,
      )
      .then(this.loadData)
      .catch(console.error);
  };

  handleEditDescription = (description) => {
    const { modelName, version } = this.props;
    return this.props
      .updateModelVersionApi(
        modelName,
        version,
        undefined,
        description,
        undefined,
        this.updateModelVersionRequestId,
      )
      .then(this.loadData)
      .catch(console.error);
  };

  pollModelVersionDetails = () => {
    const { modelName, version, apis } = this.props;
    const pollRequest = apis[this.getModelVersionDetailsRequestId];
    if (!(pollRequest && pollRequest.active) && !document.hidden) {
      this.props
        .getModelVersionApi(modelName, version, this.getModelVersionDetailsRequestId)
        .catch(console.error);
    }
  };

  componentDidMount() {
    this.loadData(true);
    this.pollIntervalId = setInterval(this.pollModelVersionDetails, POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearTimeout(this.pollIntervalId);
  }

  render() {
    const {
      modelName,
      version,
      modelVersion,
      activities,
      transitionRequests,
      runInfo,
      runDisplayName,
      history,
    } = this.props;

    return (
      <div className='App-content'>
        <RequestStateWrapper requestIds={this.criticalInitialRequestIds}>
          {(loading, hasError, requests) => {
            if (hasError) {
              clearInterval(this.pollIntervalId);
              if (shouldRender404(requests, this.criticalInitialRequestIds)) {
                return (
                  <Error404View
                    resourceName={`Model ${modelName} v${version}`}
                    fallbackHomePageReactRoute={modelListPageRoute}
                  />
                );
              }
              // TODO(Zangr) Have a more generic boundary to handle all errors, not just 404.
              triggerError(requests);
            } else if (loading) {
              return <Spinner />;
            } else if (modelVersion) { // Null check to prevent NPE after delete operation
              return (
                <ModelVersionView
                  modelName={modelName}
                  modelVersion={modelVersion}
                  activities={activities}
                  transitionRequests={transitionRequests}
                  runInfo={runInfo}
                  runDisplayName={runDisplayName}
                  handleStageTransitionDropdownSelect={this.handleStageTransitionDropdownSelect}
                  handlePendingRequestApproval={this.handlePendingRequestApproval}
                  handlePendingRequestRejection={this.handlePendingRequestRejection}
                  handlePendingRequestDeletion={this.handlePendingRequestDeletion}
                  handleEditDescription={this.handleEditDescription}
                  deleteModelVersionApi={this.props.deleteModelVersionApi}
                  history={history}
                />
              );
            }
            return null;
          }}
        </RequestStateWrapper>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { modelName, version } = ownProps.match.params;
  const activities = getModelVersionActivities(state, modelName, version);
  const modelVersion = getModelVersion(state, modelName, version);
  const transitionRequests = getModelVersionTransitionRequests(state, modelName, version);
  const runInfo = getRunInfo(modelVersion && modelVersion.run_id, state);
  const tags = runInfo && getRunTags(runInfo.getRunUuid(), state);
  const runDisplayName = tags && Utils.getRunDisplayName(tags, runInfo.getRunUuid());
  const { apis } = state;
  return {
    modelName,
    version: Number(version),
    modelVersion,
    activities,
    transitionRequests,
    runInfo,
    runDisplayName,
    apis,
  };
};

const mapDispatchToProps = {
  getModelVersionActivitiesApi,
  getModelVersionApi,
  updateModelVersionApi,
  transitionModelVersionStageApi,
  createTransitionRequestApi,
  listTransitionRequestsApi,
  approveTransitionRequestApi,
  rejectTransitionRequestApi,
  deleteTransitionRequestApi,
  deleteModelVersionApi,
  getRunApi,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModelVersionPage);
