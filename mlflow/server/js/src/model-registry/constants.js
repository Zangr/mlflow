import React from 'react';
import { Tag } from 'antd';
import * as overrides from './constant-overrides'; // eslint-disable-line import/no-namespace

export const Stages = {
  NONE: 'None',
  STAGING: 'Staging',
  PRODUCTION: 'Production',
  ARCHIVED: 'Archived',
};

export const ACTIVE_STAGES = [
  Stages.STAGING,
  Stages.PRODUCTION,
];

export const StageLabels = {
  [Stages.NONE]: 'None',
  [Stages.STAGING]: 'Staging',
  [Stages.PRODUCTION]: 'Production',
  [Stages.ARCHIVED]: 'Archived',
};

export const StageTagComponents = {
  [Stages.NONE]: <Tag>{StageLabels[Stages.NONE]}</Tag>,
  [Stages.STAGING]: <Tag color='orange'>{StageLabels[Stages.STAGING]}</Tag>,
  [Stages.PRODUCTION]: <Tag color='green'>{StageLabels[Stages.PRODUCTION]}</Tag>,
  [Stages.ARCHIVED]: (
    <Tag color='#eee' style={{ color: '#333'}}>{StageLabels[Stages.ARCHIVED]}</Tag>
  ),
};

export const ActivityTypes = {
  APPLIED_TRANSITION: 'APPLIED_TRANSITION',
  REQUESTED_TRANSITION: 'REQUESTED_TRANSITION',
  CANCELLED_REQUEST: 'CANCELLED_REQUEST',
  APPROVED_REQUEST: 'APPROVED_REQUEST',
  REJECTED_REQUEST: 'REJECTED_REQUEST',
  NEW_COMMENT: 'NEW_COMMENT',
};

export const IconByActivityType = {
  [ActivityTypes.REQUESTED_TRANSITION]: (
    <i className='far fa-hand-point-right fa-sm request-icon activity-icon' aria-hidden='true'/>
  ),
  [ActivityTypes.APPROVED_REQUEST]: (
    <i className='fas fa-check fa-sm approve-icon activity-icon' />
  ),
  [ActivityTypes.REJECTED_REQUEST]: <i className='fas fa-times fa-sm reject-icon activity-icon' />,
  [ActivityTypes.CANCELLED_REQUEST]: (
    <i className='far fa-trash-alt fa-sm cancel-icon activity-icon' />
  ),
  [ActivityTypes.NEW_COMMENT]: <i className='far fa-comment comment-icon activity-icon' />,
  [ActivityTypes.APPLIED_TRANSITION]: (
    <i className='fas fa-check fa-sm approve-icon activity-icon' />
  ),
};

export const TransitionRequestActions = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',  // NOTE: this is not a backend constant, just used for the frontend.
};

export const EMPTY_CELL_PLACEHOLDER = <div style={{ marginTop: -12 }}>_</div>;

export const ModelVersionStatus = {
  READY: 'READY',
  PENDING_REGISTRATION: 'PENDING_REGISTRATION',
  FAILED_REGISTRATION: 'FAILED_REGISTRATION',
};

export const DefaultModelVersionStatusMessages = {
  [ModelVersionStatus.READY]: 'Ready.',
  [ModelVersionStatus.PENDING_REGISTRATION]: 'Registration pending...',
  [ModelVersionStatus.FAILED_REGISTRATION]: 'Registration failed.',
};

export const modelVersionStatusIconTooltips = {
  [ModelVersionStatus.READY]: 'Ready',
  [ModelVersionStatus.PENDING_REGISTRATION]: 'Registration pending',
  [ModelVersionStatus.FAILED_REGISTRATION]: 'Registration failed',
};

export const ModelVersionStatusIcons = {
  [ModelVersionStatus.READY]:
    <i className='far fa-check-circle icon-ready model-version-status-icon' />,
  [ModelVersionStatus.PENDING_REGISTRATION]:
    <i className='fa fa-spinner fa-spin icon-pending model-version-status-icon' />,
  [ModelVersionStatus.FAILED_REGISTRATION]:
    <i className='fa fa-exclamation-triangle icon-fail model-version-status-icon' />,
};

export const MODEL_VERSION_STATUS_POLL_INTERVAL = 10000;

// TODO(Zangr) Change this to more implicit application of overrides ex. through `withOverrides()`
export const REGISTER_DIALOG_DESCRIPTION = overrides.REGISTER_DIALOG_DESCRIPTION ||
  'Once registered, the model will be available in the model registry and become public.';

export const PermissionLevels = {
  CAN_MANAGE: 'CAN_MANAGE',
  IS_OWNER: 'IS_OWNER',
  CAN_EDIT: 'CAN_EDIT',
  CAN_READ: 'CAN_READ',
};

export const MODEL_VERSION_DELETE_MENU_ITEM_DISABLED_TOOLTIP_TEXT = `Model versions in active
stages cannot be deleted. To delete this model version, transition it to the 'Archived' stage.`;

export const REGISTERED_MODEL_DELETE_MENU_ITEM_DISABLED_TOOLTIP_TEXT = `Registered models with
versions in active stages ('Staging' or 'Production') cannot be deleted. To delete this registered
model, transition versions in active stages to the 'Archived' stage.`;
