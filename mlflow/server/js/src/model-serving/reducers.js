import {
    ENABLE_SERVING,
    GET_ENDPOINT_STATUS,
    LIST_ENDPOINT_VERSIONS,
    LIST_ENDPOINT_VERSION_ALIASES,
    GET_ENDPOINT_EVENT_HISTORY,
    GET_ENDPOINT_METRIC_HISTORY,
  } from './actions';
import { fulfilled, rejected } from '../Actions';
import { getServingModelKey } from './utils';
import _ from 'lodash';

const endpointStatus = (state = {}, action) => {
  switch (action.type) {
    case fulfilled(ENABLE_SERVING): {
      const { experimentId, registeredModelName } = action.meta;
      return {
        ...state,
        [getServingModelKey(experimentId, registeredModelName)]: {
          experiment_id: experimentId,
          registered_model_name: registeredModelName,
          status: "ENDPOINT_STATE_PENDING",
        },
      };
    }
    case fulfilled(GET_ENDPOINT_STATUS): {
      const { experimentId, registeredModelName } = action.meta;
      const endpoint = action.payload.endpoint_status;
      return {
        ...state,
        [getServingModelKey(experimentId, registeredModelName)]: endpoint,
      };
    }
    case rejected(GET_ENDPOINT_STATUS): {
      const { experimentId, registeredModelName } = action.meta;
      const e = action.payload;
      if (e.xhr.status === 400 && e.getErrorCode() === "INVALID_PARAMETER_VALUE") {
        return _.omit(state, getServingModelKey(experimentId, registeredModelName));
      }
      return state;
    }
    default:
      return state;
  }
};

const endpointVersionStatus = (state = {}, action) => {
  switch (action.type) {
    case fulfilled(LIST_ENDPOINT_VERSIONS): {
      const { experimentId, registeredModelName } = action.meta;
      const modelVersions = action.payload.endpoint_versions;
      return {
        ...state,
        [getServingModelKey(experimentId, registeredModelName)]: modelVersions,
      };
    }
    default:
      return state;
  }
};

const endpointAliases = (state = {}, action) => {
  switch (action.type) {
    case fulfilled(LIST_ENDPOINT_VERSION_ALIASES): {
      const { experimentId, registeredModelName } = action.meta;
      const aliases = action.payload.aliases;
      return {
        ...state,
        [getServingModelKey(experimentId, registeredModelName)]: aliases,
      };
    }
    default:
      return state;
  }
};

const endpointEventHistory = (state = {}, action) => {
  switch (action.type) {
    case fulfilled(GET_ENDPOINT_EVENT_HISTORY): {
      const { experimentId, registeredModelName } = action.meta;
      const events = action.payload.events;
      return {
        ...state,
        [getServingModelKey(experimentId, registeredModelName)]: events,
      };
    }
    default:
      return state;
  }
};

const endpointMetricHistory = (state = {}, action) => {
  switch (action.type) {
    case fulfilled(GET_ENDPOINT_METRIC_HISTORY): {
      const metrics = action.payload.metrics;
      const { experimentId, registeredModelName } = action.meta;
      const modelKey = getServingModelKey(experimentId, registeredModelName);
      return {
        ...state,
        [modelKey]: metrics,
      };
    }
    default:
      return state;
  }
};

export default {
  endpointStatus,
  endpointVersionStatus,
  endpointAliases,
  endpointEventHistory,
  endpointMetricHistory,
};
