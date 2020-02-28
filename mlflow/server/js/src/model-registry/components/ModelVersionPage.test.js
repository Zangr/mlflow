import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import {
  mockModelVersionDetailed,
  mockModelVersionDetailedDatabricks,
  mockRegisteredModelDetailedDatabricks,
} from '../test-utils';
import { ModelVersionStatus, Stages } from '../constants';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ModelVersionPage from './ModelVersionPage';

describe('ModelVersionPage', () => {
  let wrapper;
  let minimalProps;
  let minimalStore;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    minimalProps = {
      match: {
        params: {
          modelName: 'Model A',
          version: '1',
        },
      },
      history: {
        push: jest.fn(),
      },
    };
    const versions = [
      mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY),
    ];
    minimalStore = mockStore({
      entities: {
        runInfosByUuid: {},
        modelByName: {
          'Model A': mockRegisteredModelDetailedDatabricks('Model A', versions),
        },
        modelVersionsByModel: {
          'Model A': {
            '1': mockModelVersionDetailedDatabricks(
              'Model A',
              1,
              Stages.PRODUCTION,
              ModelVersionStatus.READY,
              [],
            ),
          },
        },
        activitiesByModelVersion: {},
        transitionRequestsByModelVersion: {},
      },
      apis: {},
    });
  });

  test('should render with minimal props and store without exploding', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <ModelVersionPage {...minimalProps} />
        </BrowserRouter>
      </Provider>,
    );
    expect(wrapper.find(ModelVersionPage).length).toBe(1);
  });
});
