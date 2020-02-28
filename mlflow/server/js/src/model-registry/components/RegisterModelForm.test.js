import React from 'react';
import { shallow } from 'enzyme';
import { RegisterModelForm, CREATE_NEW_MODEL_OPTION_VALUE } from './RegisterModelForm';
import { PermissionLevels } from '../constants';
import { mockRegisteredModelDetailedDatabricks } from '../test-utils';

describe('RegisterModelForm', () => {
  let wrapper;
  let instance;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {};
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<RegisterModelForm {...minimalProps} />);
    expect(wrapper.length).toBe(1);
  });

  test('should list "Create New Model" and existing models in dropdown options', () => {
    const modelByName = {
      'Model A': mockRegisteredModelDetailedDatabricks('Model A', []),
    };
    const props = {
      ...minimalProps,
      modelByName,
    };
    wrapper = shallow(<RegisterModelForm {...props} />).dive();
    expect(wrapper.find('.create-new-model-option').length).toBe(1);
    expect(wrapper.find('[value="Model A"]').length).toBe(1);
  });

  test('should show model name input when user choose "Create New Model"', () => {
    const modelByName = {
      'Model A': mockRegisteredModelDetailedDatabricks('Model A', []),
    };
    const props = {
      ...minimalProps,
      modelByName,
    };
    wrapper = shallow(<RegisterModelForm {...props} />).dive();
    instance = wrapper.instance();
    instance.setState({ selectedModel: CREATE_NEW_MODEL_OPTION_VALUE });
    expect(wrapper.find('[label="Model Name"]').length).toBe(1);
  });

  test('should only list models for which user has EDIT permissions', () => {
    const modelByName = {
      'Model A': mockRegisteredModelDetailedDatabricks('Model A', [], PermissionLevels.CAN_READ),
      'Model B': mockRegisteredModelDetailedDatabricks('Model B', [], PermissionLevels.CAN_EDIT),
      'Model C': mockRegisteredModelDetailedDatabricks('Model C', [], PermissionLevels.CAN_MANAGE),
    };
    const props = {
      ...minimalProps,
      modelByName,
    };
    wrapper = shallow(<RegisterModelForm {...props} />).dive();
    expect(wrapper.find('.create-new-model-option').length).toBe(1);
    expect(wrapper.find('[value="Model A"]').length).toBe(0);
    expect(wrapper.find('[value="Model B"]').length).toBe(1);
    expect(wrapper.find('[value="Model C"]').length).toBe(1);
  });
});
