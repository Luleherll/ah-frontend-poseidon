import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import thunk from 'redux-thunk';
import AuthViewConnected, { AuthViewTest } from '../authView';

const mockSTore = configureStore([thunk]);
jest.mock('react-notify-toast');
const expectedStore = {
  authReducer: {
    signUpFailure: null,
    signUpSuccess: null,
  },
};

const store = mockSTore(expectedStore);
const mockSignUp = {
  Message: 'Successfully signed up',
  token: '312regwh4tr4hetrj6y5tu6yutu7y8u',
};
const mockError = {
  errors: {
    username: ['Username already exists '],
  },
};
const mockErrors = {
  errors: {
    username: ['Username already exists '],
    password: ['password should be at-least 8 characters'],
  },
};
const props = {
  postDataThunkNoHeader: jest.fn(),
  signUpActionCreatorSuccess: jest.fn(),
  signUpActionCreatorFailure: jest.fn()
};

describe('authView component', () => {
  it('it renders ', () => {
    const wrapper = mount(
      <Provider store={store}>
        <AuthViewConnected props={props} />
      </Provider>,
    );
    const event = {
      preventDefault: jest.fn(),
      target: {
        elements: {
          username: { value: 'poseidon' },
          email: { value: 'poseidon@mail.com' },
          password: { value: 'poseidon234' },
        },
      },
    };
    const wrappedForm = wrapper.find('form');
    wrappedForm.simulate('submit', event);
    expect(wrapper.find('AuthView').state('username')).toEqual('poseidon');
  });

  it('renders authView without crashing', () => {
    const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter>
            <AuthViewConnected props={props} />
          </MemoryRouter>
        </Provider>,
    );
    const newProps = { signUpData: mockSignUp };
    AuthViewConnected.prototype.props = newProps;

    expect(wrapper).toHaveLength(1);
  });

  it('component will recieve props user', () => {
    const wrapUser = shallow(<AuthViewTest {...props } />);
    wrapUser.setProps({
      signUpData: mockSignUp,
      signUpErrors: null,
    }, () => {
      expect(wrapUser.state()).toEqual(expect.objectContaining({ loader: { loading: false } }));
    });
  });

  it('component will recieve props single error', () => {
    const wrapError = shallow(<AuthViewTest {...props} />);
    wrapError.setProps({
      signUpData: null,
      signUpErrors: mockError,
    }, () => {
      expect(wrapError.state()).toEqual(expect.objectContaining({ loader: { loading: false } }));
    });
  });

  it('component will recieve props single error', () => {
    const wrapError = shallow(<AuthViewTest {...props} />);
    wrapError.setProps({
      signUpData: null,
      signUpErrors: mockErrors,
    }, () => {
      expect(wrapError.state()).toEqual(expect.objectContaining({ loader: { loading: false } }));
    });
  });
});