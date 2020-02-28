import { PermissionLevels } from '../model-registry/constants';

class PermissionUtils {
  static permissionLevelCanManage(permissionLevel) {
    return permissionLevel === PermissionLevels.CAN_MANAGE;
  }

  static permissionLevelIsOwner(permissionLevel) {
    return permissionLevel === PermissionLevels.CAN_MANAGE ||
      permissionLevel === PermissionLevels.IS_OWNER;
  }

  static permissionLevelCanEdit(permissionLevel) {
    return permissionLevel === PermissionLevels.CAN_MANAGE ||
      permissionLevel === PermissionLevels.IS_OWNER ||
      permissionLevel === PermissionLevels.CAN_EDIT;
  }

  static permissionLevelCanRead(permissionLevel) {
    return permissionLevel === PermissionLevels.CAN_MANAGE ||
      permissionLevel === PermissionLevels.IS_OWNER ||
      permissionLevel === PermissionLevels.CAN_EDIT ||
      permissionLevel === PermissionLevels.CAN_READ;
  }
}

export default PermissionUtils;
