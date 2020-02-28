import React from 'react';
import { mount, shallow } from 'enzyme';
import { ModelView, StageFilters } from './ModelView';
import {
  mockModelVersionDetailed,
  mockRegisteredModelDetailedDatabricks,
  mockModelVersionDetailedDatabricks,
} from '../test-utils';
import {
  ModelVersionStatus,
  PermissionLevels,
  Stages,
} from '../constants';
import { BrowserRouter } from 'react-router-dom';
import { ModelVersionTable } from './ModelVersionTable';
import { Dropdown } from 'antd';
import Utils from '../../utils/Utils';

describe('ModelView', () => {
  let wrapper;
  let instance;
  let minimalProps;
  const mockModel = {
    name: 'Model A',
    latestVersions: [
      mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY),
      mockModelVersionDetailed('Model A', 2, Stages.STAGING, ModelVersionStatus.READY),
      mockModelVersionDetailed('Model A', 3, Stages.NONE, ModelVersionStatus.READY),
    ],
    versions: [
      mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.PRODUCTION,
        ModelVersionStatus.READY,
        [],
      ),
      mockModelVersionDetailedDatabricks(
        'Model A',
        2,
        Stages.STAGING,
        ModelVersionStatus.READY,
        [],
      ),
      mockModelVersionDetailedDatabricks('Model A', 3, Stages.NONE, ModelVersionStatus.READY, []),
    ],
    permissionLevel: PermissionLevels.CAN_EDIT,
  };

  beforeEach(() => {
    minimalProps = {
      model: mockRegisteredModelDetailedDatabricks(
        mockModel.name,
        mockModel.latestVerions,
        mockModel.permissionLevel,
      ),
      modelVersions: mockModel.versions,
      handleEditDescription: jest.fn(),
      handleDelete: jest.fn(),
      showEditPermissionModal: jest.fn(),
      history: { push: jest.fn() },
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...minimalProps} />
      </BrowserRouter>
    );
    expect(wrapper.find(ModelView).length).not.toBeNull();
  });

  test('should render all model versions initially', () => {
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...minimalProps} />
      </BrowserRouter>
    );
    expect(wrapper.find('td.model-version').length).toBe(3);
    expect(wrapper.find('td.model-version').at(0).text()).toBe('Version 1');
    expect(wrapper.find('td.model-version').at(1).text()).toBe('Version 2');
    expect(wrapper.find('td.model-version').at(2).text()).toBe('Version 3');
  });

  test('should render model version table with activeStageOnly when "Active" button is on', () => {
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...minimalProps} />
      </BrowserRouter>
    );
    expect(wrapper.find(ModelVersionTable).props().activeStageOnly).toBe(false);
    instance = wrapper.find(ModelView).instance();
    instance.setState({ stageFilter: StageFilters.ACTIVE });
    wrapper.update();
    expect(wrapper.find(ModelVersionTable).props().activeStageOnly).toBe(true);
  });

  test('should render description edit button based on user permissions', () => {
    // should render description edit button if user has edit permissions
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...minimalProps} />
      </BrowserRouter>
    );
    expect(wrapper.find({type: "form"}).length).toBe(1);

    // should not render description edit button if user does not have edit permissions
    const readProps = {
      ...minimalProps,
      model: {
        ...minimalProps.model,
        permission_level: PermissionLevels.CAN_READ,
      },
    };
    wrapper.setProps({
      children: <ModelView {...readProps} />,
    });
    expect(wrapper.find({type: "form"}).length).toBe(0);
  });

  test('should render menu breadcrumb based on user permissions', () => {
    // should render menu breadcrumb if user has manage permissions
    const props = {
      ...minimalProps,
      model: {
        ...minimalProps.model,
        permission_level: PermissionLevels.CAN_MANAGE,
      },
    };
    wrapper = shallow(<ModelView {...props} />);
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).not.toBe(0);

    // should not render menu breadcrumb if user does not have manage permissions
    wrapper.setProps({
      model: {
        ...minimalProps.model,
        permission_level: PermissionLevels.CAN_EDIT,
      },
    });
    expect(wrapper.find('.breadcrumb-header').find(Dropdown).length).toBe(0);
  });

  test('should trigger showEditPermissionModal when permission menu item is clicked', () => {
    const props = {
      ...minimalProps,
      model: {
        ...minimalProps.model,
        permission_level: PermissionLevels.CAN_MANAGE,
      },
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...props} />
      </BrowserRouter>
    );
    wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
    wrapper.find('.edit-permission').hostNodes().simulate('click');
    expect(minimalProps.showEditPermissionModal).toHaveBeenCalled();
  });

  test('should show/hide edit permission menu item base on config', () => {
    const props = {
      ...minimalProps,
      model: {
        ...minimalProps.model,
        permission_level: PermissionLevels.CAN_MANAGE,
      },
    };
    Utils.isAclCheckEnabledForModelRegistry = jest.fn().mockReturnValue(true);
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...props} />
      </BrowserRouter>
    );
    // should show edit permission menu item when ACL for model registry is enabled
    wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
    expect(wrapper.find('.edit-permission').hostNodes().length).toBe(1);

    // should not show edit permission menu item when ACL for model registry is disabled
    // for the org via the feature flag or the "Workspace ACLs" setting.
    Utils.isAclCheckEnabledForModelRegistry = jest.fn().mockReturnValue(false);
    wrapper.setProps({ children: <ModelView {...props} /> });
    wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
    expect(wrapper.find('.edit-permission').hostNodes().length).toBe(0);
  });

  test("Page title is set", () => {
    const mockUpdatePageTitle = jest.fn();
    Utils.updatePageTitle = mockUpdatePageTitle;
    wrapper = shallow(<ModelView {...minimalProps}/>);
    expect(mockUpdatePageTitle.mock.calls[0][0]).toBe("Model A - MLflow Model");
  });

  test('should disable dropdown delete menu item when model has active versions', () => {
    const props = {
      ...minimalProps,
      model: {
        ...minimalProps.model,
        permission_level: PermissionLevels.CAN_MANAGE,
      },
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...props} />
      </BrowserRouter>
    );
    wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
    // The antd `Menu.Item` component converts the `disabled` attribute to `aria-disabled`
    // when generating HTML. Accordingly, we check for the presence of the `aria-disabled`
    // attribute within the rendered HTML.
    const deleteMenuItem = wrapper.find(".delete").hostNodes();
    expect(deleteMenuItem.prop('aria-disabled')).toBe(true);
    deleteMenuItem.simulate('click');
    expect(wrapper.find(ModelView).instance().state.isDeleteModalVisible).toBe(false);
  });

  test('should enable dropdown delete menu item when model has no active versions', () => {
    const latestVersions = [
      mockModelVersionDetailed('Model A', 1, Stages.NONE, ModelVersionStatus.READY),
      mockModelVersionDetailed('Model A', 2, Stages.ARCHIVED, ModelVersionStatus.READY),
    ];
    const versions = [
      mockModelVersionDetailedDatabricks(
        'Model A',
        1,
        Stages.NONE,
        ModelVersionStatus.READY,
        [],
      ),
      mockModelVersionDetailedDatabricks(
        'Model A',
        2,
        Stages.ARCHIVED,
        ModelVersionStatus.READY,
        [],
      ),
    ];
    const props = {
      ...minimalProps,
      model: mockRegisteredModelDetailedDatabricks(
        mockModel.name,
        latestVersions,
        PermissionLevels.CAN_MANAGE,
      ),
      modelVersions: versions,
    };
    wrapper = mount(
      <BrowserRouter>
        <ModelView {...props} />
      </BrowserRouter>
    );
    wrapper.find('.breadcrumb-dropdown').hostNodes().simulate('click');
    // The antd `Menu.Item` component converts the `disabled` attribute to `aria-disabled`
    // when generating HTML. Accordingly, we check for the presence of the `aria-disabled`
    // attribute within the rendered HTML.
    const deleteMenuItem = wrapper.find(".delete").hostNodes();
    expect(deleteMenuItem.prop('aria-disabled')).toBeUndefined;
    deleteMenuItem.simulate('click');
    expect(wrapper.find(ModelView).instance().state.isDeleteModalVisible).toBe(true);
  });
});
