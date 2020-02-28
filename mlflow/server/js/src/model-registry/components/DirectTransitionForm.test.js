import React from 'react';
import { shallow } from 'enzyme';
import DirectTransitionForm from './DirectTransitionForm';

describe('DirectTransitionForm', () => {
  let wrapper;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {};
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<DirectTransitionForm {...minimalProps}/>);
    expect(wrapper.length).toBe(1);
  });
});
