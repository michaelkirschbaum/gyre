import React, {PropTypes} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  NativeModules
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
  ListItem
} from 'native-base';
import colors from '../../config/colors';
import en from '../../config/localization.en';
import fr from '../../config/localization.fr';
if (NativeModules.SettingsManager.settings.AppleLocale.startsWith("fr"))
  var loc = fr;
else
  var loc = en;
import carfitTheme from '../../config/carfit-theme';
import Swiper from 'react-native-swiper';
import * as NavigationState from '../navigation/NavigationState';

const SettingsView = React.createClass({
  render() {
    let windowHeight = Dimensions.get('window').height;
    let windowWidth = Dimensions.get('window').width;
    headerTitle = loc.settings.settings;

    return (
      <Container theme={carfitTheme}>
        <Header>
          <Button transparent onPress={() => this.popRoute()}>
            <Icon name="ios-arrow-back"/>
          </Button>
          <Title>{headerTitle}</Title>
        </Header>
        <View style={styles.headerLine}/>
        <Content
          padder={false}
          keyboardShouldPersistTaps="always"
          style={{flex: 1, backgroundColor: colors.backgroundPrimary, height: windowHeight}}
          ref={c => this._content = c}>

          <View style={styles.layoutContainer}>
            <View style={styles.settingsContainer}>
              <H1 style={styles.menuText} onPress={this.onMyCarsPress}>{loc.settings.myCars}</H1>
              {/* <H1 style={styles.menuText}>{loc.settings.sensors}</H1> */}
              <H1 style={styles.menuText} onPress={this.onMyAccountPress}>{loc.settings.myAccount}</H1>
              {/* <H1 style={styles.menuText} onPress={this.onDrivePress}>{loc.settings.drive}</H1> */}
              {/* <H1 style={styles.menuText}>{loc.settings.useWiFi}</H1> */}
            </View>
            <View style={styles.settingsSubContainer}>
              <H2 style={{marginBottom: 7}} onPress={this.onTermsPress}>{loc.settings.terms}</H2>
              <H2 onPress={this.onPrivacyPress}>{loc.settings.privacy}</H2>
              <Text style={{paddingTop: 20}}>{loc.settings.copyright}</Text>
            </View>
        </View>
        </Content>
      </Container>
    );
  },

  onMyCarsPress() {
    this.props.pushRoute({key: 'MyCars', title: loc.settings.settings});
  },

  onMyAccountPress() {
    this.props.pushRoute({key: 'Account', title: loc.settings.settings});
  },

  onPrivacyPress() {
    this.props.pushRoute({key: 'Privacy', title: loc.settings.settings});
  },

  onTermsPress() {
    this.props.pushRoute({key: 'Terms', title: loc.settings.settings});
  },

  onDrivePress() {
    this.props.pushRoute({key: 'Drive', title: loc.settings.drive});
  },

  popRoute() {
    this.props.onNavigateBack();
  }
});

const styles = StyleSheet.create({
  headerLine: {
    height: 1,
    backgroundColor: colors.headerTextColor
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary
  },
  layoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  askMilesContainer: {
    marginTop: 22
  },
  textInput: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.primary,
    borderWidth: 2.5,
    marginTop: 22
  },
  settingsContainer: {
    flex: 1,
    flexGrow: 20,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 24
  },
  settingsSubContainer: {
    flex: 1,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 8,
    marginBottom: 8,
    // backgroundColor: '#550000'
  },
  menuText: {
    marginBottom: 24,
    fontWeight: "bold"
  },

  image: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  titles: {
    marginTop: 17,
    marginBottom: 8
  },
  footer: {
    height: 200,
    // backgroundColor: colors.backgroundPrimary,
    backgroundColor: '#550000',
    borderColor: colors.backgroundPrimary,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default SettingsView;
