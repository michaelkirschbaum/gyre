import {connect} from 'react-redux';
import {pushRoute, popRoute, switchRoute, openDrawer, closeDrawer, navigationCompleted, switchToMain} from '../navigation/NavigationState';
import {setPageIndex, discover, clearDevices, setDrive, setConnection, setSpinner, setModalVisible} from './InstallationState';
import InstallationView from './InstallationView';

export default connect(
  state => ({
    installation: state.get('installation').toJS(),
    navigationState: state.get('navigationState').toJS(),
  }),
  dispatch => ({
    switchRoute(index) {
      dispatch(switchRoute(index));
    },
    pushRoute(index) {
      dispatch(pushRoute(index));
    },
    onNavigateBack() {
      dispatch(popRoute());
    },
    openDrawer() {
      dispatch(openDrawer());
    },
    closeDrawer() {
      dispatch(closeDrawer());
    },
    setPageIndex(index) {
      dispatch(setPageIndex(index));
    },
    discover() {
      dispatch(discover());
    },
    clearDevices() {
      dispatch(clearDevices());
    },
    setDrive(value) {
      dispatch(setDrive(value));
    },
    setConnection(status) {
      dispatch(setConnection(status));
    },
    setSpinner(state) {
      dispatch(setSpinner(state));
    },
    setModalVisible(state) {
      dispatch(setModalVisible(state));
    },
    switchToMain() {
      dispatch(switchToMain());
    }
  })
)(InstallationView);
