import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import {
  mockModelVersionDetailed,
  mockRegisteredModelDetailedDatabricks,
} from '../test-utils';
import { ModelVersionStatus, Stages } from '../constants';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import ModelPage from './ModelPage';

describe('ModelPage', () => {
  let wrapper;
  let minimalProps;
  let minimalStore;
  const mockStore = configureStore([thunk, promiseMiddleware()]);

  beforeEach(() => {
    minimalProps = {
      match: {
        params: {
          modelName: 'Model A',
        },
      },
      history: {
        push: jest.fn(),
      },
      searchModelVersionsApi: jest.fn(() => Promise.resolve({})),
      getRegisteredModelDetailsApi: jest.fn(() => Promise.resolve({})),
    };
    const versions = [
      mockModelVersionDetailed('Model A', 1, Stages.PRODUCTION, ModelVersionStatus.READY),
    ];
    minimalStore = mockStore({
      entities: {
        modelByName: {
          'Model A': mockRegisteredModelDetailedDatabricks('Model A', versions),
        },
        modelVersionsByModel: {
          'Model A': {
            '1': mockRegisteredModelDetailedDatabricks(
              'Model A',
              1,
              Stages.PRODUCTION,
              ModelVersionStatus.READY,
              [],
            ),
          },
        },
      },
      apis: {},
    });
  });

  test('should render with minimal props and store without exploding', () => {
    wrapper = mount(
      <Provider store={minimalStore}>
        <BrowserRouter>
          <ModelPage {...minimalProps} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find(ModelPage).length).toBe(1);
  });
});
