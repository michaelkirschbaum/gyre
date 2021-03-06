import {Map, fromJS} from 'immutable';
import {loop, combineReducers} from 'redux-loop';
import NavigationStateReducer from '../modules/navigation/NavigationState';
import InstallationStateReducer from '../modules/installation/InstallationState';
import CarInstallationState from '../modules/carInstalltion/CarInstallationState';
import LoginStateReducer from '../modules/login/LoginState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';
import {reducer} from 'redux-form';
import HomeReducer from '../modules/home/HomeState';
import NorautoReducer from '../modules/norauto/NorautoState';

const reducers = {
  // @NOTE: By convention, the navigation state must live in a subtree called
  //`navigationState`
  navigationState: NavigationStateReducer,

  session: SessionStateReducer,

  installation: InstallationStateReducer,

  carInstallation: CarInstallationState,

  login: LoginStateReducer,

  form: reducer,

  home: HomeReducer,

  norauto: NorautoReducer
};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
  reducers,
  immutableStateContainer,
  getImmutable,
  setImmutable
);

export default function mainReducer(state, action) {
  // If the action is RESET_STATE then the action.payload replaces all the current state, otherwise reduce as normal.
  const [nextState, effects] = (action.type === RESET_STATE) ? namespacedReducer(action.payload, action) : namespacedReducer(state || void 0, action);

  // enforce the state is immutable
  return loop(fromJS(nextState), effects);
}
