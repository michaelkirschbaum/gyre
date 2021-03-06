import {connect} from 'react-redux';
import {pushRoute, popRoute, switchRoute, openDrawer, closeDrawer, navigationCompleted} from '../navigation/NavigationState';
import {changeUserCode} from './NorautoState';
import NorautoView from './NorautoView';

export default connect(
  state => ({
    norauto: state.get('norauto').toJS(),
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
    changeUserCode(code) {
      dispatch(changeUserCode(code));
    }
  })
)(NorautoView);
