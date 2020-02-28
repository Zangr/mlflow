import React from 'react';
import { shallow } from 'enzyme';
import { ModelActivitiesList } from './ModelActivitiesList';
import { mockActivity } from '../test-utils';
import { ActivityTypes, Stages } from '../constants';
import { Steps } from 'antd';

describe('ModelActivitiesList', () => {
  let wrapper;
  let minimalProps;

  beforeEach(() => {
    minimalProps = {
      activities: [
        mockActivity(ActivityTypes.REQUESTED_TRANSITION, Stages.NONE, Stages.STAGING),
      ],
    };
  });

  test('should render with minimal props without exploding', () => {
    wrapper = shallow(<ModelActivitiesList {...minimalProps}/>);
    expect(wrapper.length).toBe(1);
  });

  test('should sort activities by timestamp', () => {
    const earlierTime = new Date().getTime() - 10000;
    const props = {
      ...minimalProps,
      activities: [
        mockActivity(ActivityTypes.REQUESTED_TRANSITION, Stages.NONE, Stages.STAGING),
        mockActivity(ActivityTypes.APPLIED_TRANSITION, Stages.NONE, Stages.ARCHIVED, earlierTime),
      ],
    };
    wrapper = shallow(<ModelActivitiesList {...props}/>);
    expect(wrapper.find(Steps.Step).first().html()).toContain('applied');
    expect(wrapper.find(Steps.Step).last().html()).toContain('requested');
  });
});
