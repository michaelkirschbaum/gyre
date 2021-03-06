import React, {PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  AsyncStorage,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Alert
} from 'react-native';
import {
  Container,
  Header,
  Footer,
  Title,
  Content,
  InputGroup,
  Input,
  Button,
  Icon,
  Text,
  H3,
  H2,
  H1,
  List,
  ListItem,
  Card,
  CardItem
} from 'native-base';
import store from '../../redux/store';
import * as NavigationState from '../navigation/NavigationState';
import Modal from 'react-native-simple-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import ConnectionMonitor from '../../components/ConnectionMonitor';
import Swiper from 'react-native-swiper';
import Connection from '../../carfit/connection';
import Vehicle from '../../carfit/vehicle';
import colors from '../../config/colors';
import carfitTheme from '../../config/carfit-theme';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import en from '../../config/localization.en';
import fr from '../../config/localization.fr';
const {CarFitManager} = NativeModules;

// set language
if (NativeModules.SettingsManager.settings.AppleLocale.startsWith("fr"))
  var loc = fr;
else
  var loc = en;

const HomeView = React.createClass({
  getInitialState() {
    return {
      title: '',
      description: '',
      photo: '',
      wheelAngle: 0,
      alert: '',
      trips: '',
      meters: '',
      new_meters: '',
      total_distance: 0
    };
  },

  render() {
    // button values
    let buttonAction = loc.home.click;

    // alert values
    let alertAction = loc.home.serviceNeeded;
    let alertColor = colors.secondary;

    // usage values
    let usageAction = loc.home.lastTrip;
    let actionColor = colors.primary;

    // value values
    let valueAction = loc.home.trending;
    let valueDescription = loc.home.comingSoon;

    return (
      <Container theme={carfitTheme}>
        <View style={styles.headerLine}/>
        <Content
          padder={false}
          keyboardShouldPersistTaps="always"
          style={{backgroundColor: colors.backgroundPrimary}}
          ref={c => this._content = c}>

          {/* Navigation */}
          <View style={styles.container}>
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={this.onSettingsPress}>
                <Image source={require('../../../images/icons/settings.png')}
                       style={styles.icon}/>
              </TouchableOpacity>
              <ConnectionMonitor connected={this.props.connected} angle={this.state.wheelAngle}/>
              <TouchableOpacity onPress={this.onMilesPress}>
                <Image source={require('../../../images/icons/miles.png')} style={styles.icon}/>
              </TouchableOpacity>
            </View>
            <View style={styles.profileHeaderContainer}>
              <H1 style={styles.title}>{this.state.title}</H1>
              <H2 style={styles.description}>{this.state.description}</H2>
              <Button rounded
                      style={styles.milesButton}
                      textStyle={styles.button}
                      onPress={() => this.props.setModal(true)}
              >{this.state.meters}</Button>
            </View>
            <View style={styles.divider}/>

            {/* Support */}
            {this.locationFrance() &&
              <View style={{flexDirection: 'column'}}>
                <View style={styles.dataBlockContainer}>
                  <View style={styles.dataIcon}>
                    <Image source={require('../../../images/icons/push.png')} style={styles.icon}/>
                  </View>
                  <View style={styles.dataBlock}>
                    <H3 style={{fontWeight: "bold", color: actionColor}}>{loc.home.button}</H3>
                    <View style={{ height: 1, backgroundColor: colors.headerTextColor, marginTop: 2, marginBottom: 2}}/>
                    <H3 style={styles.text}>{buttonAction}</H3>
                  </View>
                </View>

                    <Button rounded
                                    bordered={false}
                                    style={styles.syncbtn}
                                    textStyle={{color: colors.textPrimary}}
                                    onPress={this.onButtonPress}>
                        <Image source={require('../../../images/icons/push-button.png')} style={styles.syncimg}/>
                    </Button>
              </View>
            }

            {/* Service alerts */}
            {!this.locationFrance() &&
              <View style={styles.dataBlockContainer}>
                <View style={styles.dataIcon}>
                  <Image source={require('../../../images/icons/service.png')} style={styles.icon}/>
                </View>
                <View style={styles.dataBlock}>
                  <H3 style={{fontWeight: "bold", color: alertColor}}>{loc.home.alert}</H3>
                  <View style={{ height: 1, backgroundColor: colors.headerTextColor, marginTop: 2, marginBottom: 2}}/>
                  <H3 style={styles.text}>{alertAction}</H3>
                  <Text style={styles.text}>{this.state.alert}</Text>
                </View>
                <View style={styles.dataAction}>
                  <Button transparent onPress={() => this.props.pushRoute({key: 'Alerts', title: loc.home.alert})}>
                    <Icon active name="ios-arrow-forward"></Icon>
                  </Button>
                </View>
              </View>
            }

            {/* Usage data */}
            <View style={styles.dataBlockContainer}>
                <View style={styles.dataIcon}>
                  <Image source={require('../../../images/icons/usage.png')} style={styles.icon}/>
                </View>
                <View style={styles.dataBlock}>
                  <H3 style={{fontWeight: "bold", color: actionColor}}>{loc.home.usage}</H3>
                  <View style={{ height: 1, backgroundColor: colors.headerTextColor, marginTop: 2, marginBottom: 2}}/>
                  <H3 style={styles.text}>{usageAction}</H3>
                  <Text>{this.state.trips}</Text>
                </View>
                <View style={styles.dataAction}>
                  <Button transparent onPress={() => this.props.pushRoute({key: 'Usage', title: loc.home.usage})}>
                    <Icon active name="ios-arrow-forward"></Icon>
                  </Button>
                </View>

            </View>

            {/* Value */}
            {!this.locationFrance() &&
              <View style={styles.dataBlockContainer}>
                <View style={styles.dataIcon}>
                  <Image source={require('../../../images/icons/value.png')} style={styles.icon}/>
                </View>
                <View style={styles.dataBlock}>
                  <H3 style={{fontWeight: "bold", color: colors.headerTextColor}}>{loc.home.value}</H3>
                  <View style={{ height: 1, backgroundColor: colors.headerTextColor, marginTop: 2, marginBottom: 2}}/>
                  <H3 style={{color: colors.headerTextColor}}>{valueAction}</H3>
                  <Text style={{color: colors.headerTextColor}}>{valueDescription}</Text>
                </View>
              </View>
            }
          </View>

          {/* odometer */}
          <Modal
            open={this.props.home.modalVisible}
            modalDidOpen={() => undefined}
            modalDidClose={() => undefined}
            style={{alignItems: 'center'}}
            closeOnTouchOutside={false}
            containerStyle={{}}
            modalStyle={{
              borderRadius: 7,
              height: 160
            }}>

            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{color: 'black', alignSelf: 'center'}}>{this.useMetric() ? loc.home.updateKm : loc.home.updateMi}</Text>
              <Input style={styles.textInput}
                ref='odometerInput'
                placeholder={this.useMetric() ? loc.home.kilometrage : loc.home.mileage}
                onChangeText={(text) => this.setState({new_meters: text})}
              />

              {/* set */}
              <Button rounded
                    style={{alignSelf: 'center'}}
                    textStyle={{color: colors.textPrimary}}
                    onPress={() => this.setOdometer(this.state.new_meters)}
              >{loc.home.save}</Button>

              {/* cancel */}
              <Button transparent
                    textStyle={{color: 'black'}}
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      // turn off modal
                      this.props.setModal(false)

                      // if finished onboarding show instructions
                      if (this.props.navigationState.onboarding) {
                        setTimeout(function() {
                          Alert.alert(
                            loc.home.success,
                            loc.home.instructions,
                            {text: 'OK', onPress: () => console.log('OK Pressed.')}
                          );
                        }, 1000);

                        // turn of onboarding mode
                        this.props.setOnboarding(false);
                      }
                    }}
              >{loc.home.cancel}</Button>
            </View>
          </Modal>

        </Content>
      </Container>
    );
  },

  // Forward setNativeProps to a child
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  },

  componentDidMount() {
    // event listners
    var connectionEmitter = new NativeEventEmitter(CarFitManager);

    // get vehicle
    const vin = this.props.vehicle.vin;
    var vehicle = new Vehicle(vin);

    // display vehicle information
    this.loadVehicle().done();

    // load odometer
    this.setState({meters: this.convertToLocal(this.props.vehicle.odometer).toString() + (this.useMetric() ? ' km' : ' mi')})

    // update odometer while driving
    this.distance_subscription = connectionEmitter.addListener(
      'TripMetersTraveled',
      (notification) => this.addDistance(notification["metersTraveled"])
    );

    // update odometer while not driving
    this.odometer_update = setInterval(function() {
      if (!store.getState().get("installation").get("in_drive")) {
        this.loadOdometer(vehicle).done();
        this.setState({total_distance: 0});
      }
    }.bind(this), 60000);

    // display most current vehicle alert
    this.loadAlerts().done();

    // display and update last trip distance
    this.loadUsage().done();
    this.usage_update = setInterval(function() {
      this.loadUsage().done();
    }.bind(this), 60000);

    this.wheel_angle = connectionEmitter.addListener(
      'TripSteeringWheelAngle',
      (message) => this.rotateWheel(message["angle"])
    );
  },

  async setOdometer(distance) {
    // get vehicle
    const vin = this.props.vehicle.vin;
    var vehicle = new Vehicle(vin);

    if (isNaN(distance) || distance == '')
      this.props.setModal(false);
    else {
      // set local
      this.setState({meters: distance + (this.useMetric() ? ' km' : ' mi')});
      this.props.setOdometer(this.convertToMeters(parseInt(distance)));

      // set db
      vehicle.setMileage(vin, this.convertToMeters(parseInt(distance)));

      // hide modal
      this.props.setModal(false);

      // if finished onboarding show instructions
      if (this.props.navigationState.onboarding) {
        setTimeout(function() {
          Alert.alert(
            loc.home.success,
            loc.home.instructions,
            {text: 'OK', onPress: () => console.log('OK Pressed.')}
          );
        }, 1000);

        // turn of onboarding mode
        this.props.setOnboarding(false);
      }
    }
  },

  addDistance(meters) {
    // convert
    var distance = this.convertToLocal(meters);

    // subtract previous total distance from odometer
    var odometer = this.state.meters;

    if (odometer == '')
      odometer = '0 mi';

    // parse odometer
    var current = parseInt(odometer.split(" ")[0]) - this.state.total_distance;
    var units = odometer.split(" ")[1];

    // add distance traveled to current total
    updated = current + distance;

    // update odometer
    this.setState({meters: updated.toString() + ' ' + units});
    this.props.setOdometer(this.convertToMeters(updated));

    // set new cumulative distance
    this.setState({total_distance: distance});
  },

  rotateWheel(angle) {
    this.setState({wheelAngle: angle});
  },

  async loadOdometer() {
    var vehicle = new Vehicle(this.props.vehicle.vin);

    if (meters = await vehicle.getMileage()) {
      if (meters > this.props.vehicle.odometer)
        this.setState({meters: this.convertToLocal(meters).toString() + (this.useMetric() ? ' km' : ' mi')});
      else
        this.setState({meters: this.convertToLocal(this.props.vehicle.odometer).toString() + (this.useMetric() ? ' km' : ' mi')})
    }
    else
      this.setState({meters: ''});
  },

  async loadAlerts() {
    const vin = this.props.vehicle.vin;
    var vehicle = new Vehicle(vin);

    var alerts = await vehicle.getAlerts('alert', vin);
    if (alerts) {
      // set to first alert
      var alert = alerts[0].summary;
      this.setState({alert});

      // serialize alerts
      try {
        await AsyncStorage.setItem('alerts', JSON.stringify(alerts));
      } catch(e) {
        console.error(e);
      }
    } else {
      this.setState({alert: loc.home.error});
    }
  },

  async loadUsage() {
    var vehicle = new Vehicle();
    const vin = this.props.vehicle.vin;

    var trips = await vehicle.getTrips(vin);

    if (trips) {
      // remove trips that aren't at least a mile
      trips = trips.filter(this.minimumDistance);

      // get last trip if exists
      if (trips.length) {
        var trip = trips[0].meters_travelled;

        // convert to miles
        var trip = this.convertToLocal(trip);

        // add units
        trip = trip.toString() + (this.useMetric() ? ' km' : ' mi');
      }
      else
        trip = loc.home.error;

      // set last trip
      this.setState({trips: trip});

      // serialize trips
      try {
        await AsyncStorage.setItem('trips', JSON.stringify(trips));
      } catch(e) {
        console.warn(e);
      }
    } else {
      this.setState({trips: loc.home.error});

      try {
        await AsyncStorage.setItem('trip', JSON.stringify([]));
      } catch(e) {

      }
    }
  },

  async loadVehicle() {
    // get vehicle
    const vin = this.props.vehicle.vin;
    var vehicle = new Vehicle(vin);

    // load title
    var title = await vehicle.getTitle();
    if (title) {
      this.setState({title});
    } else {
      console.log("title not loaded");
    }

    // load description
    var description = await vehicle.getDescription();
    if (description) {
      this.setState({description});
    } else {
      console.log("description not loaded");
    }

    // load photo
    var photo = await vehicle.getPhoto();
    if (photo) {
      this.setState({photo});
    } else {
      console.log("photo not loaded");
    }
  },

  async onButtonPress() {
    var conn = new Connection();
    var resp = await conn.simulateButtonClick();

    if (resp)
      Alert.alert(
        loc.home.support,
        loc.home.call,
        {text: 'OK', onPress: () => console.log('OK pressed.')}
      );
    else {
      Alert.alert(
        loc.home.support,
        loc.home.supportError,
        {text: 'OK', onPress: () => console.log('OK Pressed.')}
      );
    }
  },

  componentWillUnmount() {
    // stop updating distance traveled
    this.distance_subscription.remove();

    // stop updating wheel angle
    this.wheel_angle.remove();
  },

  onSettingsPress() {
    this.props.pushRoute({key: 'Settings', title: loc.settings.settings});
  },

  onMilesPress() {
    Linking.openURL("https://carfit.zendesk.com/").catch(err => console.error('An error occurred', err));
  },

  convertToLocal(meters) {
    // get location
    var region = NativeModules.SettingsManager.settings.AppleLocale;

    // if in US or Britain use Miles, otherwise use Kilometers
    if (region.endsWith('US') || region.endsWith('GB')) {
      return Math.round(meters / 1609.344);
    } else {
      return Math.round(meters / 1000);
    }
  },

  convertToMeters(distance) {
    // get location
    var region = NativeModules.SettingsManager.settings.AppleLocale;

    // if in US or Britain use Miles, otherwise use Kilometers
    if (region.endsWith('US') || region.endsWith('GB')) {
      return Math.round(distance * 1609.344);
    } else {
      return Math.round(distance * 1000);
    }
  },

  // todo: use map instead
  minimumDistance(trip) {
    return this.convertToLocal(trip.meters_travelled) > 0;
  },

  useMetric() {
    var region = NativeModules.SettingsManager.settings.AppleLocale;

    if (region.endsWith("US") || region.endsWith("GB"))
      return false;
    else
      return true;
  },

  locationFrance() {
    if (NativeModules.SettingsManager.settings.AppleLocale.endsWith("FR"))
      return true;
    else
      return false;
  }
});

const styles = StyleSheet.create({
  headerLine: {
    height: 1,
    backgroundColor: colors.headerTextColor
  },
  container: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 55,
    marginBottom: 16,
  },
  profileHeaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  milesButton: {
    backgroundColor: colors.textSecondary,
    alignSelf: 'auto',
    marginTop: 16,
    // height: responsiveHeight(4),
  },
  dataBlockContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20 //16
  },
  dataIcon: {
    marginRight: 16
  },
  dataBlock: {
    flex: 1,
  },
  dataAction: {
    marginLeft: 16,
  },
  askMilesContainer: {
    marginTop: 22
  },
  textInput: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.primary,
    borderWidth: 2.5,
    borderRadius: 20,
    width: 220,
    textAlign: 'center'
  },
  image: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    justifyContent: 'center',
    alignItems: 'center'
  },
  titles: {
    marginTop: 17,
    marginBottom: 8
  },
  footer: {
    height: 90,
    backgroundColor: colors.backgroundPrimary,
    borderColor: colors.backgroundPrimary
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {

  },
  button: {
    color: colors.textPrimary,
    // width: responsiveHeight(10),
    textAlign: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: colors.headerTextColor,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  syncbtn: {
    alignItems: 'center',
    width: 20,
    height: 20,
    // width: responsiveHeight(5),
    // height: responsiveHeight(5),
    marginTop: 45,
    marginLeft: 158,
    marginBottom: 20
  },
  syncimg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {},
  description: {
    marginTop: 5
  }
});

export default HomeView;
