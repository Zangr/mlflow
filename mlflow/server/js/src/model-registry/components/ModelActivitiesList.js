import React from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';
import { ActivityTypes, StageTagComponents, IconByActivityType } from '../constants';
import _ from 'lodash';
import Utils from '../../utils/Utils';

export class ModelActivitiesList extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(PropTypes.shape({
      activity_type: PropTypes.string,
      from_stage: PropTypes.string,
      to_stage: PropTypes.string,
    })).isRequired,
  };

  static defaultProps = {
    activities: [],
  };

  static getTitle(activity) {
    const isTransitionActivity = activity.to_stage;
    if (!isTransitionActivity) {
      return (
        <span>
          {' '}
          <b> {activity.user_id} </b> commented: {activity.comment}{' '}
        </span>
      );
    } else {
      return (
        <span>
          {' '}
          <b> {activity.user_id} </b> {getTransitionRequestString(activity)}{' '}
          {StageTagComponents[activity.from_stage]}
          <i className='fas fa-long-arrow-alt-right' />
          &nbsp;&nbsp;
          {StageTagComponents[activity.to_stage]}
          {<span className='timestamp'>{Utils.timeSince(activity.timestamp)} ago</span>}
        </span>
      );
    }
  }

  static getDescription(activity) {
    if (activity.to_stage && !(activity.comment === '')) {
      return (
        <div className='comment-wrapper'>
          <p className='comment'> {activity.comment} </p>
        </div>
      );
    } else {
      return undefined;
    }
  }

  createSteps(activities) {
    const sortedActivities = _.sortBy(activities, 'timestamp');
    return sortedActivities.map((activity) => (
      <Steps.Step
        key={activity.timestamp}
        icon={
          <div className='activity-icon-wrapper'>{IconByActivityType[activity.activity_type]}</div>
        }
        status='finish'
        title={ModelActivitiesList.getTitle(activity)}
        description={ModelActivitiesList.getDescription(activity)}
      />
    ));
  }

  render() {
    return (
      <Steps direction='vertical' size='small' className='activity-steps'>
        {this.createSteps(this.props.activities)}
      </Steps>
    );
  }
}

const getTransitionRequestString = (activity) => {
  let requestStr = '';
  if (activity.activity_type === ActivityTypes.REQUESTED_TRANSITION) {
    requestStr = ' requested a stage transition';
  } else if (activity.activity_type === ActivityTypes.APPROVED_REQUEST) {
    requestStr = ' approved a stage transition';
  } else if (activity.activity_type === ActivityTypes.REJECTED_REQUEST) {
    requestStr = ' rejected a stage transition';
  } else if (activity.activity_type === ActivityTypes.CANCELLED_REQUEST) {
    requestStr = ' cancelled their stage transition request';
  } else if (activity.activity_type === ActivityTypes.NEW_COMMENT) {
    requestStr = ' commented';
  } else if (activity.activity_type === ActivityTypes.APPLIED_TRANSITION) {
    requestStr = ' applied a stage transition';
  } else {
    throw new Error('Unrecognized Activity type!');
  }
  return requestStr;
};
