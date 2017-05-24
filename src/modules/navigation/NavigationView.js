import React, {PropTypes} from 'react';
import {
  Platform,
  NavigationExperimental,
  View,
  StatusBar,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  Alert
} from 'react-native';
const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes
} = NavigationExperimental;
import AppRouter from '../AppRouter';
import {
  Content,
  Text,
  List,
  ListItem
} from 'native-base';
import BluetoothMonitor from '../../components/BluetoothMonitor';
import NetworkMonitor from '../../components/NetworkMonitor';
import FirmwareNotification from '../../components/FirmwareNotification';
import Drawer from 'react-native-drawer';
import stylesMain from '../../config/styles';
import en from '../../config/localization.en';
import fr from '../../config/localization.fr';
const {CarFitManager} = NativeModules;

// set language
if (NativeModules.SettingsManager.settings.AppleLocale.startsWith("fr"))
  var loc = fr;
else
  var loc = en;
// const styles = stylesMain;

// Customize bottom tab bar height here if desired
const TAB_BAR_HEIGHT = 30;

const NavigationView = React.createClass({
  propTypes: {
    onNavigateBack: PropTypes.func.isRequired, // Calls popRoute
    onNavigateCompleted: PropTypes.func.isRequired,
    navigationState: PropTypes.object.isRequired,
    switchRoute: PropTypes.func.isRequired,
    pushRoute: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func.isRequired,
    openDrawer: PropTypes.func.isRequired,
  },

  closeDrawer() {
    if (this.props.navigationState.drawerOpen === true) {
      this.props.closeDrawer();
    }
  },

  renderScene(sceneProps) {
    // render scene and apply padding to cover
    // for app bar and navigation bar
    return (
      <View style={styles.sceneContainer}>
        {AppRouter(sceneProps)}
      </View>
    );
  },

  render() {
    // Pulls out the roots
    const {roots} = this.props.navigationState;
    // Gets the current root by index
    const rootKey = roots.routes[roots.index].key;
    // Then grabs the current scene
    const scenes = this.props.navigationState[rootKey];

    return (
      <Drawer
        open={this.props.navigationState.drawerOpen}
        ref={(ref) => { this._drawer = ref;}}
        type="overlay"
        content={<FirmwareNotification percent={this.props.navigationState.updateProgress}/>}
        openDrawerOffset={0.94}
        side="bottom"
      >
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
          backgroundColor='gray'
        />
        <NavigationCardStack
          key={'stack_' + rootKey}
          onNavigateBack={this.props.onNavigateBack}
          navigationState={scenes}
          renderScene={this.renderScene}
        />
      </Drawer>
    );
  },

  componentWillMount() {
    var connectionEmitter = new NativeEventEmitter(CarFitManager);

    // set flag for start of trip
    var trip_subscription = connectionEmitter.addListener(
      'TripStartOfTravel',
      (notification) => this.props.setDrive(true)
    );

    // set flag for end of trip
    var trip_subscription = connectionEmitter.addListener(
      'TripEndOfTravel',
      (notification) => this.props.setDrive(false)
    );

    // flag bluetooth connection status
    var connection_subscription = connectionEmitter.addListener(
      'BLEDeviceConnectionStatus',
      (message) => this.props.setConnection(message["status"])
    );

    if (this.locationFrance())
      // listen for support click
      var support_subscription = connectionEmitter.addListener(
        'BLEButtonPress',
        (reminder) => Alert.alert(
          loc.home.support,
          loc.home.call,
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        )
      );

    // update firmware
    var update_firmware_subscription = connectionEmitter.addListener(
      'BLEOADNotification',
      (notification) => this.setFirmware(notification)
    );
  },

  setFirmware(notification) {
    switch(notification.state) {
      case "start":
        // enable progress indicator
        this.props.openDrawer()
        break;
      case "stop":
        // check whether update successful
        if (notification.status == "success")
          this.props.closeDrawer();
        else {
          if (this.props.installation.modalVisible) {
            this.props.closeDrawer();

            // disable modal if in selection view
            this.props.setInstallationModal(false);
          }
          else {
            this.props.closeDrawer();

            // disable onboarding mode
            this.props.setOnboarding(false);

            // redirect to selectionview
            this.props.pushRoute('Installation');
          }
        }

        // reset progress indicator
        this.props.updateFirmware('');
        break;
      default:
        this.props.updateFirmware(notification.percent);
        break;
    }
  },

  locationFrance() {
    if (NativeModules.SettingsManager.settings.AppleLocale.endsWith("FR"))
      return true;
    else
      return false;
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sceneContainer: {
    flex: 1,
    // marginBottom: TAB_BAR_HEIGHT
  }
});

export default NavigationView;
