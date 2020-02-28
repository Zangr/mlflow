import { Services } from './services';
import { getUUID, wrapDeferred } from '../Actions';

// We strip nulls from the dictionary, because oneof values like
// experiment_id and registered_model_name will be mis-encoded as a JSON
// GET request. Example: '?experiment_id=&registered_model_name=foo'. experiment_id
// is interpreted as the empty string, which is converted to 0, which is non-null.
const stripNulls = (dict) => {
  const newDict = {};
  Object.keys(dict).forEach(key => {
    if (dict[key] !== null) {
      newDict[key] = dict[key];
    }
  });
  return newDict;
};

export const ENABLE_SERVING = 'ENABLE_SERVING';
export const enableServingApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: ENABLE_SERVING,
    payload: wrapDeferred(Services.enableServing, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const DISABLE_SERVING = 'DISABLE_SERVING';
export const disableServingApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: DISABLE_SERVING,
    payload: wrapDeferred(Services.disableServing, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const GET_ENDPOINT_STATUS = 'GET_ENDPOINT_STATUS';
export const getEndpointStatusApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: GET_ENDPOINT_STATUS,
    payload: wrapDeferred(Services.getEndpointStatus, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const LIST_ENDPOINT_VERSIONS = 'LIST_ENDPOINT_VERSIONS';
export const listEndpointVersionsApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: LIST_ENDPOINT_VERSIONS,
    payload: wrapDeferred(Services.listEndpointVersions, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const GET_ENDPOINT_VERSION_LOGS = 'GET_ENDPOINT_VERSION_LOGS';
export const getEndpointVersionLogsApi = (
    experimentId,
    registeredModelName,
    endpointVersionName,
    id = getUUID(),
  ) => ({
    type: GET_ENDPOINT_VERSION_LOGS,
    payload: wrapDeferred(Services.getEndpointVersionLogs, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
      endpoint_version_name: endpointVersionName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const LIST_ENDPOINT_VERSION_ALIASES = 'LIST_ENDPOINT_VERSION_ALIASES';
export const listEndpointVersionAliasesApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: LIST_ENDPOINT_VERSION_ALIASES,
    payload: wrapDeferred(Services.listEndpointVersionAliases, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const GET_ENDPOINT_EVENT_HISTORY = 'GET_ENDPOINT_EVENT_HISTORY';
export const getEndpointEventHistoryApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: GET_ENDPOINT_EVENT_HISTORY,
    payload: wrapDeferred(Services.getEndpointEventHistory, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });

export const GET_ENDPOINT_METRIC_HISTORY = 'GET_ENDPOINT_METRIC_HISTORY';
export const getEndpointMetricHistoryApi = (
    experimentId,
    registeredModelName,
    id = getUUID(),
  ) => ({
    type: GET_ENDPOINT_METRIC_HISTORY,
    payload: wrapDeferred(Services.getEndpointMetricHistory, stripNulls({
      experiment_id: experimentId,
      registered_model_name: registeredModelName,
    })),
    meta: { id, experimentId, registeredModelName },
  });


export const SUBMIT_SERVING_REQUEST = 'SUBMIT_SERVING_REQUEST';
export const submitServingRequestApi = (
    modelName,
    modelVersionName,
    servingRequestPayload,
    id = getUUID(),
  ) => ({
    type: SUBMIT_SERVING_REQUEST,
    payload: wrapDeferred(Services.submitServingRequest, {
      modelName: modelName,
      modelVersionName: modelVersionName,
      servingRequestPayload: servingRequestPayload,
    }),
    meta: { id },
  });
