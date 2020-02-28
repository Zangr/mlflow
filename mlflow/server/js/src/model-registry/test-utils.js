export const mockRegisteredModelDetailed = (name, latestVersions = []) => {
  return {
    creation_timestamp: 1571344731467,
    last_updated_timestamp: 1573581360069,
    latest_versions: latestVersions,
    name, // TODO(Zangr) remove this after removing inline
  };
};

export const mockRegisteredModelDetailedDatabricks = (
  name,
  latestVersions = [],
  permissionLevel = 'CAN_EDIT',
  ) => {
  return {
    creation_timestamp: 1571344731467,
    last_updated_timestamp: 1573581360069,
    latest_versions: latestVersions,
    name, // TODO(Zangr) remove this after removing inline
    id: 'abcdefghijklmnop12345',
    permission_level: permissionLevel,
  };
};

export const mockModelVersionDetailed = (name, version, stage, status) => {
  return {
    name,
    creation_timestamp: 1571344731614,
    last_updated_timestamp: 1573581360069,
    user_id: 'richard@example.com',
    current_stage: stage,
    description: '',
    source: 'path/to/model',
    run_id: 'b99a0fc567ae4d32994392c800c0b6ce',
    status,
    version, // TODO(Zangr) remove this after removing inline
  };
};

export const mockModelVersionDetailedDatabricks = (
  name,
  version,
  stage,
  status,
  open_requests,
  permissionLevel = 'CAN_MANAGE',
  ) => {
  return {
    name,
    creation_timestamp: 1571344731614,
    last_updated_timestamp: 1573581360069,
    user_id: 'richard@example.com',
    current_stage: stage,
    description: '',
    source: 'path/to/model',
    run_id: 'b99a0fc567ae4d32994392c800c0b6ce',
    status,
    version, // TODO(Zangr) remove this after removing inline
    open_requests,
    permission_level: permissionLevel,
  };
};

export const mockTransitionRequest = (
  type,
  toStage,
  permissionLevel = 'CAN_MANAGE',
  timestamp = new Date().getTime(),
  ) => {
  return {
    timestamp,
    user_id: 'richard@example.com',
    activity_type: type,
    transition: {
      to_stage: toStage,
    },
    permission_level: permissionLevel,
  };
};

export const mockActivity = (type, fromStage, toStage, timestamp = new Date().getTime()) => {
  return {
    timestamp,
    user_id: 'richard@example.com',
    activity_type: type,
    from_stage: fromStage,
    to_stage: toStage,
  };
};

