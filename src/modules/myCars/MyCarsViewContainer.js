import {connect} from 'react-redux';
import {pushRoute, popRoute, switchRoute, openDrawer, closeDrawer, navigationCompleted} from '../navigation/NavigationStateBLAH';
import MyCarsView from './MyCarsView';

export default connect(
  state => ({
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
  })
)(MyCarsView);
