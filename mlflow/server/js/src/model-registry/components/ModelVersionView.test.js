import React from 'react';
import { shallow, mount } from 'enzyme';
import { ModelVersionView } from './ModelVersionView';
import { mockModelVersionDetailedDatabricks } from '../test-utils';
import {
  Stages,
  ModelVersionStatus,
  ModelVersionStatusIcons,
  PermissionLevels,
  ACTIVE_STAGES,
} from '../constants';
import { Alert, Dropdown } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import Utils from "../../utils/Utils";

describe('ModelVersionView', () => {
  let wrapper;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {
      modelName: 'Model A',
      modelVersion: mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.PRODUCTION,
        ModelVersionStatus.READY,
        [],
      ),
      handleStageTransitionDropdownSelect: jest.fn(),
      handlePendingRequestTransition: jest.fn(),
      handlePendingRequestDeletion: jest.fn(),
      deleteModelVersionApi: jest.fn(() => Promise.resolve()),
      handleEditDescription: jest.fn(() => Promise.resolve()),
      history: { push: jest.fn() },
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ModelVersionView {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should display loading banner when model version is pending', () => {
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.PENDING_REGISTRATION,
        [],
      ),
    };
    wrapper = shallow(<ModelVersionView {...props} />);
    expect(wrapper.find(Alert).length).toBe(1);
    expect(wrapper.find(Alert).props().icon).toBe(
      ModelVersionStatusIcons[ModelVersionStatus.PENDING_REGISTRATION],
    );
  });

  test('should display error banner when model version failed to be registered', () => {
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.FAILED_REGISTRATION,
        [],
      ),
    };
    wrapper = shallow(<ModelVersionView {...props} />);
    expect(wrapper.find(Alert).length).toBe(1);
    expect(wrapper.find(Alert).props().icon).toBe(
      ModelVersionStatusIcons[ModelVersionStatus.FAILED_REGISTRATION],
    );
  });

  test('should render delete dropdown item when model version is ready', () => {
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.READY,
        [],
      ),
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelVersionView {...props} />
      </BrowserRouter>
    );
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).toBe(1);
  });

  test('should render delete dropdown item when model version failed to be registered', () => {
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.FAILED_REGISTRATION,
        [],
      ),
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelVersionView {...props} />
      </BrowserRouter>
    );
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).toBe(1);
  });

  test('should not render delete dropdown item when model version is pending registration', () => {
    const props = {
      ...minimalProps,
      modelVersion: mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.PENDING_REGISTRATION,
        [],
      ),
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelVersionView {...props} />
      </BrowserRouter>
    );
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).toBe(0);
  });

  test('should disable dropdown delete menu item when model version is in active stage', () => {
    let i;
    for (i = 0; i < ACTIVE_STAGES.length; ++i) {
      const props = {
        ...minimalProps,
        modelVersion: mockModelVersionDetailedDatabricks(
          'Model A',
          1,
          ACTIVE_STAGES[i],
          ModelVersionStatus.READY,
          [],
        ),
      };
      wrapper = mount(
        <BrowserRouter>
          <ModelVersionView {...props} />
        </BrowserRouter>
      );
      wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
      // The antd `Menu.Item` component converts the `disabled` attribute to `aria-disabled`
      // when generating HTML. Accordingly, we check for the presence of the `aria-disabled`
      // attribute within the rendered HTML.
      const deleteMenuItem = wrapper.find(".delete").hostNodes();
      expect(deleteMenuItem.prop('aria-disabled')).toBe(true);
      deleteMenuItem.simulate('click');
      expect(wrapper.find(ModelVersionView).instance().state.isDeleteModalVisible).toBe(false);
    }
  });

  test('should enable dropdown delete menu item when model version is in active stage', () => {
    const inactiveStages = [Stages.NONE, Stages.ARCHIVED];
    let i;
    for (i = 0; i < inactiveStages.length; ++i) {
      const props = {
        ...minimalProps,
        modelVersion: mockModelVersionDetailedDatabricks(
          'Model A',
          1,
          inactiveStages[i],
          ModelVersionStatus.READY,
          [],
        ),
      };
      wrapper = mount(
        <BrowserRouter>
          <ModelVersionView {...props} />
        </BrowserRouter>
      );
      wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
      // The antd `Menu.Item` component converts the `disabled` attribute to `aria-disabled`
      // when generating HTML. Accordingly, we check for the presence of the `aria-disabled`
      // attribute within the rendered HTML.
      const deleteMenuItem = wrapper.find(".delete").hostNodes();
      expect(deleteMenuItem.prop('aria-disabled')).toBeUndefined();
      deleteMenuItem.simulate('click');
      expect(wrapper.find(ModelVersionView).instance().state.isDeleteModalVisible).toBe(true);
    }
  });

  test('should render description edit button based on user permissions', () => {
    // should render description edit button if user has edit permissions
    const modelVersion = mockModelVersionDetailedDatabricks(
      'Model A',
      1,
      Stages.NONE,
      ModelVersionStatus.READY,
      [],
      PermissionLevels.CAN_EDIT,
    );
    const props = {
      ...minimalProps,
      modelVersion,
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelVersionView {...props} />
      </BrowserRouter>
    );
    expect(wrapper.find({type: "form"}).length).toBe(1);

    // should not render description edit button if user does not have edit permissions
    const readProps = {
      ...minimalProps,
      modelVersion: {
        ...modelVersion,
        permission_level: PermissionLevels.CAN_READ,
      },
    };
    wrapper.setProps({
      children: <ModelVersionView {...readProps} />,
    });
    expect(wrapper.find({type: "form"}).length).toBe(0);
  });

  test('should render menu breadcrumb based on user permissions', () => {
    // should render menu breadcrumb if user has manage permissions
    const modelVersion = mockModelVersionDetailedDatabricks(
      'Model A',
      1,
      Stages.NONE,
      ModelVersionStatus.READY,
      [],
      PermissionLevels.CAN_MANAGE,
    );
    const props = {
      ...minimalProps,
      modelVersion: modelVersion,
    };
    wrapper = shallow(<ModelVersionView {...props} />);
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).not.toBe(0);

    // should not render menu breadcrumb if user does not have manage permissions
    wrapper.setProps({
      modelVersion: {
        ...modelVersion,
        permission_level: PermissionLevels.CAN_EDIT,
      },
    });
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).toBe(0);
  });

  test("Page title is set", () => {
    const mockUpdatePageTitle = jest.fn();
    Utils.updatePageTitle = mockUpdatePageTitle;
    wrapper = shallow(<ModelVersionView {...minimalProps}/>);
    expect(mockUpdatePageTitle.mock.calls[0][0]).toBe("Model A v1 - MLflow Model");
  });
});
