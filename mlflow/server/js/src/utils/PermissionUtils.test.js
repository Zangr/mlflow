import PermissionUtils from './PermissionUtils';

test("permissionLevelCanManage", () => {
  expect(PermissionUtils.permissionLevelCanManage('CAN_MANAGE')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanManage('IS_OWNER')).toEqual(false);
  expect(PermissionUtils.permissionLevelCanManage('CAN_EDIT')).toEqual(false);
  expect(PermissionUtils.permissionLevelCanManage('CAN_READ')).toEqual(false);
  expect(PermissionUtils.permissionLevelCanManage('RANDOM_STRING')).toEqual(false);
});

test("permissionLevelIsOwner", () => {
  expect(PermissionUtils.permissionLevelIsOwner('CAN_MANAGE')).toEqual(true);
  expect(PermissionUtils.permissionLevelIsOwner('IS_OWNER')).toEqual(true);
  expect(PermissionUtils.permissionLevelIsOwner('CAN_EDIT')).toEqual(false);
  expect(PermissionUtils.permissionLevelIsOwner('CAN_READ')).toEqual(false);
  expect(PermissionUtils.permissionLevelIsOwner('RANDOM_STRING')).toEqual(false);
});

test("permissionLevelCanEdit", () => {
  expect(PermissionUtils.permissionLevelCanEdit('CAN_MANAGE')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanEdit('IS_OWNER')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanEdit('CAN_EDIT')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanEdit('CAN_READ')).toEqual(false);
  expect(PermissionUtils.permissionLevelCanEdit('RANDOM_STRING')).toEqual(false);
});

test("permissionLevelCanRead", () => {
  expect(PermissionUtils.permissionLevelCanRead('CAN_MANAGE')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanRead('IS_OWNER')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanRead('CAN_EDIT')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanRead('CAN_READ')).toEqual(true);
  expect(PermissionUtils.permissionLevelCanRead('RANDOM_STRING')).toEqual(false);
});
