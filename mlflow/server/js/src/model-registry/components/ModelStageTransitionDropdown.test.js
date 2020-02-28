import React from 'react';
import { shallow } from 'enzyme';
import { ModelStageTransitionDropdown } from './ModelStageTransitionDropdown';
import { PermissionLevels, Stages } from '../constants';
import { Dropdown } from 'antd';

describe('ModelStageTransitionDropdown', () => {
  let wrapper;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {
      currentStage: Stages.NONE,
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ModelStageTransitionDropdown {...minimalProps}/>);
    expect(wrapper.length).toBe(1);
  });

  test('should omit current stage in dropdown', () => {
    const props = {
      ...minimalProps,
      currentStage: Stages.STAGING,
    };
    wrapper = shallow(<ModelStageTransitionDropdown {...props} />);
    wrapper.find('.stage-transition-dropdown').simulate('click');
    const menuHtml = shallow(wrapper.find(Dropdown).props().overlay).html();
    expect(menuHtml).not.toContain(Stages.STAGING);
    expect(menuHtml).toContain(Stages.PRODUCTION);
    expect(menuHtml).toContain(Stages.NONE);
    expect(menuHtml).toContain(Stages.ARCHIVED);
  });

  test('should render "transition to" items if user has manage permissions', () => {
    const props = {
      ...minimalProps,
      permissionLevel: PermissionLevels.CAN_MANAGE,
    };
    wrapper = shallow(<ModelStageTransitionDropdown {...props} />);
    wrapper.find('.stage-transition-dropdown').simulate('click');
    const menuHtml = shallow(wrapper.find(Dropdown).props().overlay).html();
    expect(menuHtml).toContain("Transition to");
    expect(menuHtml).toContain("Request transition to");
  });

  test('should not render "transition to" items if user does not have manage permissions', () => {
    const props = {
      ...minimalProps,
      permissionLevel: PermissionLevels.CAN_EDIT,
    };
    wrapper = shallow(<ModelStageTransitionDropdown {...props} />);
    wrapper.find('.stage-transition-dropdown').simulate('click');
    const menuHtml = shallow(wrapper.find(Dropdown).props().overlay).html();
    expect(menuHtml).not.toContain("Transition to");
    expect(menuHtml).toContain("Request transition to");
  });
});
