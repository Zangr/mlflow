import React from 'react';
import { shallow } from 'enzyme';
import TransitionRequestForm from './TransitionRequestForm';

describe('TransitionRequestForm', () => {
  let wrapper;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {};
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<TransitionRequestForm {...minimalProps}/>);
    expect(wrapper.length).toBe(1);
  });
});
