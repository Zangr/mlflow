import React from 'react';
import { shallow } from 'enzyme';
import { PendingRequestsTable } from './PendingRequestsTable';
import { mockTransitionRequest } from '../test-utils';
import { ActivityTypes, PermissionLevels, Stages } from '../constants';

describe('PendingRequestsTable', () => {
  let wrapper;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {
      pendingRequests: [mockTransitionRequest(ActivityTypes.REQUESTED_TRANSITION, Stages.STAGING)],
      onPendingRequestTransition: jest.fn(),
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<PendingRequestsTable {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should render cancel action but not other actions if user has owner permissions', () => {
    const props = {
      ...minimalProps,
      pendingRequests: [mockTransitionRequest(
        ActivityTypes.REQUESTED_TRANSITION,
        Stages.STAGING,
        PermissionLevels.IS_OWNER)],
    };
    wrapper = shallow(<PendingRequestsTable {...props} />);
    const html = wrapper.html();
    expect(html).toContain("Cancel");
    expect(html).not.toContain("Reject");
    expect(html).not.toContain("Approve");
  });

  test('rendering reject or approve action based on current user permissions', () => {
    // should not render description edit button if user does not have edit permissions
    const props = {
      ...minimalProps,
      pendingRequests: [mockTransitionRequest(
        ActivityTypes.REQUESTED_TRANSITION,
        Stages.STAGING,
        PermissionLevels.CAN_EDIT)],
    };
    wrapper = shallow(<PendingRequestsTable {...props} />);
    expect(wrapper.html()).not.toContain("Reject");
    expect(wrapper.html()).not.toContain("Approve");
    expect(wrapper.html()).not.toContain("Cancel");

    // should render reject and approve actions if user has manage permissions
    wrapper.setProps({
      pendingRequests: [mockTransitionRequest(
        ActivityTypes.REQUESTED_TRANSITION,
        Stages.STAGING,
        PermissionLevels.CAN_MANAGE)],
    });
    expect(wrapper.html()).toContain("Reject");
    expect(wrapper.html()).toContain("Approve");
    expect(wrapper.html()).toContain("Cancel");
  });
});
