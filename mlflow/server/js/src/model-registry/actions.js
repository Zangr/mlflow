import { Services } from './services';
import { getUUID, wrapDeferred } from '../Actions';

export const CREATE_REGISTERED_MODEL = 'CREATE_REGISTERED_MODEL';
export const createRegisteredModelApi = (name, id = getUUID()) => ({
  type: CREATE_REGISTERED_MODEL,
  payload: wrapDeferred(Services.createRegisteredModel, { name }),
  meta: { id, name },
});

export const LIST_REGISTRED_MODELS = 'LIST_REGISTRED_MODELS';
export const listRegisteredModelsApi = (id = getUUID()) => ({
  type: LIST_REGISTRED_MODELS,
  payload: wrapDeferred(Services.listRegisteredModels, {}),
  meta: { id },
});

export const UPDATE_REGISTERED_MODEL = 'UPDATE_REGISTERED_MODEL';
export const updateRegisteredModelApi = (name, description, id = getUUID()) => ({
  type: UPDATE_REGISTERED_MODEL,
  payload: wrapDeferred(Services.updateRegisteredModel, {
    name,
    description,
  }),
  meta: { id },
});

export const DELETE_REGISTERED_MODEL = 'DELETE_REGISTERED_MODEL';
export const deleteRegisteredModelApi = (model, id = getUUID()) => ({
  type: DELETE_REGISTERED_MODEL,
  payload: wrapDeferred(Services.deleteRegisteredModel, {
    name: model,
  }),
  meta: { id, model },
});

export const CREATE_MODEL_VERSION = 'CREATE_MODEL_VERSION';
export const createModelVersionApi = (name, source, runId, id = getUUID()) => ({
  type: CREATE_MODEL_VERSION,
  payload: wrapDeferred(Services.createModelVersion, { name, source, run_id: runId }),
  meta: { id, name, runId },
});



export const SEARCH_MODEL_VERSIONS = 'SEARCH_MODEL_VERSIONS';
export const searchModelVersionsApi = (filterObj, id = getUUID()) => {
  const filter = Object.keys(filterObj).map((key) => `${key}="${filterObj[key]}"`).join('&');
  return {
    type: SEARCH_MODEL_VERSIONS,
    payload: wrapDeferred(Services.searchModelVersions, { filter }),
    meta: { id },
  };
};

export const UPDATE_MODEL_VERSION = 'UPDATE_MODEL_VERSION';
export const updateModelVersionApi = (
  modelName,
  version,
  stage,
  description,
  comment,
  id = getUUID(),
) => ({
  type: UPDATE_MODEL_VERSION,
  payload: wrapDeferred(Services.updateModelVersion, {
    name: modelName,
    version: version,
    stage,
    description,
    comment,
  }),
  meta: { id },
});

export const TRANSITION_MODEL_VERSION_STAGE = 'TRANSITION_MODEL_VERSION_STAGE';
export const transitionModelVersionStageApi = (
  modelName,
  version,
  stage,
  archiveExistingVersions,
  comment,
  id = getUUID(),
) => ({
  type: TRANSITION_MODEL_VERSION_STAGE,
  payload: wrapDeferred(Services.transitionModelVersionStage, {
    name: modelName,
    version,
    stage,
    archive_existing_versions: archiveExistingVersions,
    comment,
  }),
  meta: { id },
});

export const DELETE_MODEL_VERSION = 'DELETE_MODEL_VERSION';
export const deleteModelVersionApi = (modelName, version, id = getUUID()) => ({
  type: DELETE_MODEL_VERSION,
  payload: wrapDeferred(Services.deleteModelVersion, {
    name: modelName,
    version: version,
  }),
  meta: { id, modelName, version },
});

export const GET_REGISTERED_MODEL = 'GET_REGISTERED_MODEL';
export const getRegisteredModelApi = (modelName, id = getUUID()) => ({
  type: GET_REGISTERED_MODEL,
  payload: wrapDeferred(Services.getRegisteredModel, {
    name: modelName,
  }),
  meta: { id, modelName },
});

export const GET_MODEL_VERSION = 'GET_MODEL_VERSION';
export const getModelVersionApi = (modelName, version, id = getUUID()) => ({
  type: GET_MODEL_VERSION,
  payload: wrapDeferred(Services.getModelVersion, {
    name: modelName,
    version: version,
  }),
  meta: { id, modelName, version },
});

export const CREATE_TRANSITION_REQUEST = 'CREATE_TRANSITION_REQUEST';
export const createTransitionRequestApi = (modelName, version, stage, comment, id = getUUID()) => ({
  type: CREATE_TRANSITION_REQUEST,
  payload: wrapDeferred(Services.createTransitionRequest, {
    name: modelName,
    version: version,
    stage: stage,
    comment,
  }),
  meta: { id, modelName, version },
});

export const LIST_TRANSITION_REQUESTS = 'LIST_TRANSITION_REQUESTS';
export const listTransitionRequestsApi = (modelName, version, id = getUUID()) => ({
  type: LIST_TRANSITION_REQUESTS,
  payload: wrapDeferred(Services.listTransitionRequests, {
    name: modelName,
    version: version,
  }),
  meta: { id, modelName, version },
});

export const APPROVE_TRANSITION_REQUEST = 'APPROVE_TRANSITION_REQUEST';
export const approveTransitionRequestApi = (
  modelName,
  version,
  stage,
  archiveExistingVersions,
  comment,
  id = getUUID(),
) => ({
  type: APPROVE_TRANSITION_REQUEST,
  payload: wrapDeferred(Services.approveTransitionRequest, {
    name: modelName,
    version,
    stage,
    archive_existing_versions: archiveExistingVersions,
    comment,
  }),
  meta: { id },
});

export const REJECT_TRANSITION_REQUEST = 'REJECT_TRANSITION_REQUEST';
export const rejectTransitionRequestApi = (
  modelName,
  version,
  stage,
  comment,
  id = getUUID(),
) => ({
  type: REJECT_TRANSITION_REQUEST,
  payload: wrapDeferred(Services.rejectTransitionRequest, {
    name: modelName,
    version,
    stage,
    comment,
  }),
  meta: { id },
});

export const DELETE_TRANSITION_REQUEST = 'DELETE_TRANSITION_REQUEST';
export const deleteTransitionRequestApi = (
  modelName,
  version,
  comment,
  creatorId,
  stage,
  id = getUUID(),
) => ({
  type: DELETE_TRANSITION_REQUEST,
  payload: wrapDeferred(Services.deleteTransitionRequest, {
    name: modelName,
    version: version,
    stage: stage,
    creator: creatorId,
    comment,
  }),
  meta: { id },
});
