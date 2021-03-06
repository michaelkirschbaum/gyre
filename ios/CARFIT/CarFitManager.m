//
//  CarFitManager.m
//  CARFIT
//
//  Created by Chris McClenaghan on 1/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CarFitManager.h"
#import <React/RCTLog.h>
#import <AWSCore/AWSCore.h>

#import "CFPAWSCarfitapivClient.h"

@interface CarFitManager () <CFPCoreBLEDelegate, CFPCoreTripDelegate>
@property RCTPromiseResolveBlock connectBLEDeviceAsyncResolveBlock;
@property RCTPromiseRejectBlock connectBLEDeviceAsyncRejectBlock;
@end

@implementation CarFitManager
{
  BOOL hasRCTListeners;
}

- (instancetype) init {
  self = [super init];
  if (self) {
    NSLog(@"%s - init success\n", __FUNCTION__);
    [[CFPCore sharedInstance] setBLEDelegate:self];
    [[CFPCore sharedInstance] setTripDelegate:self];
    [self start];
  };
  return self;
}

- (NSString *) VIN {
  return [[CFPCore sharedInstance] VIN];
}

- (void) start {
  [[CFPCore sharedInstance] start];
}

#pragma CFPCore BLE Delegate

- (void) didFailToConnectDevice:(NSError *) error {
  if (self.connectBLEDeviceAsyncRejectBlock) {
    self.connectBLEDeviceAsyncRejectBlock(@"BLEDeviceConnectionFailed", error.localizedDescription, error);
    self.connectBLEDeviceAsyncRejectBlock = nil;
    self.connectBLEDeviceAsyncResolveBlock = nil;
  }
}

- (void) didConnectDevice {
  if (self.connectBLEDeviceAsyncResolveBlock) {
    self.connectBLEDeviceAsyncResolveBlock(@1);
    self.connectBLEDeviceAsyncResolveBlock = nil;
    self.connectBLEDeviceAsyncRejectBlock = nil;
  } else {
    if (hasRCTListeners) {
      [self sendEventWithName:@"BLEDeviceConnectionStatus" body:@{@"name": @"BLEDeviceConnectionStatus", @"status" : @1}];
    }
  }
}

- (void) didDisconnectDevice {
//  if (self.connectBLEDeviceAsyncRejectBlock) {
//    NSError * error = [NSError errorWithDomain:@"fit.car.iOSSDK.BLE" code:1 userInfo:nil];
//    self.connectBLEDeviceAsyncRejectBlock(@"BLEDeviceConnectionFailed", error.localizedDescription, error);
//    self.connectBLEDeviceAsyncRejectBlock = nil;
//    self.connectBLEDeviceAsyncResolveBlock = nil;
//  } else {
    if (hasRCTListeners) {
      [self sendEventWithName:@"BLEDeviceConnectionStatus" body:@{@"name": @"BLEDeviceConnectionStatus", @"status" : @0}];
    }
//  }
}

- (void) didDiscoverDevice {
  // use event propagation to notify
  NSLog(@"%s", __FUNCTION__);
}

- (void) buttonPress {
  if (hasRCTListeners) {
    [self sendEventWithName:@"BLEButtonPress" body:@{@"name": @"BLEButtonPress"}];
  }
}

- (void) buttonResponse:(AWSTask *) response {
  NSDictionary * responseDictionary = nil;
  if (response.error) {
    responseDictionary = @{@"domain":response.error.domain, @"code":[NSString stringWithFormat:@"%ld", response.error.code]};
  } else {
    responseDictionary = @{};
  }

  if (hasRCTListeners) {
    [self sendEventWithName:@"BLEButtonResponse" body:@{@"name": @"BLEButtonResponse", @"response" : responseDictionary}];
  }
}

- (void) startOAD {
  if (hasRCTListeners) {
    [self sendEventWithName:@"BLEOADNotification" body:@{@"name": @"BLEOADNotification", @"state" : @"start"}];
  }
}

- (void) stopOAD:(BOOL) status {
  if (hasRCTListeners) {
    [self sendEventWithName:@"BLEOADNotification" body:@{@"name": @"BLEOADNotification", @"state" : @"stop", @"status" : status ? @"success" : @"failure" }];
  }
}

- (void) percentCompleteOAD:(NSUInteger) percent {
  if (hasRCTListeners) {
    [self sendEventWithName:@"BLEOADNotification" body:@{@"name": @"BLEOADNotification", @"percent" : [NSString stringWithFormat:@"%lu", (unsigned long)percent] }];
  }
}

#pragma CFPCore Trip Delegate

- (void) metersTraveled:(NSInteger) meters {
  // use event propagation to notify
  if (hasRCTListeners) {
    [self sendEventWithName:@"TripMetersTraveled" body:@{@"name": @"TripMetersTraveled", @"metersTraveled" : @(meters)}];
  }
}

- (void) startOfTravel {
  if (hasRCTListeners) {
    [self sendEventWithName:@"TripStartOfTravel" body:@{@"name": @"TripStartOfTravel"}];
  }
}

- (void) endOfTravel:(NSInteger) totalMetersTraveled {
  if (hasRCTListeners) {
    [self sendEventWithName:@"TripEndOfTravel" body:@{@"name": @"TripEndOfTravel", @"totalMetersTraveled" : @(totalMetersTraveled)}];
  }
}

- (void) steeringWheelAngle:(float) angle {
  if (hasRCTListeners) {
    [self sendEventWithName:@"TripSteeringWheelAngle" body:@{@"name": @"TripSteeringWheelAngle", @"angle" : @(angle)}];
  }
}

- (void) vehicleSpeed:(double)metersPerSecond {
  if (hasRCTListeners) {
    [self sendEventWithName:@"TripVehicleMetersPerSecond" body:@{@"name": @"TripVehicleMetersPerSecond", @"metersPerSecond" : @(metersPerSecond)}];
  }
}

#pragma React Native Bridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setPhone:(NSString *) phone)
{
  [[CFPCore sharedInstance] setPhone:phone];
}

RCT_REMAP_METHOD(availableBLEDevicesAsync,
                 availableBLEDevicesResolver:(RCTPromiseResolveBlock)resolve
                 availableBLEDevicesRejecter:(RCTPromiseRejectBlock)reject)
{
#if TARGET_OS_SIMULATOR
  NSArray * devices = @[@{@"name": @"CARFIT", @"identifier": @"129AB20934" , @"signal": @"0.5"}];
#else
  NSArray * devices = [[CFPCore sharedInstance] bleDiscoveredDevices];
#endif

  resolve(devices);
}

RCT_EXPORT_METHOD(connectBLEDeviceAsync:(NSString *) identifier
                 connectBLEDeviceResolver:(RCTPromiseResolveBlock)resolve
                 connectBLEDeviceRejecter:(RCTPromiseRejectBlock)reject)
{
#if TARGET_OS_SIMULATOR
  resolve(nil);
#else
  if ([[CFPCore sharedInstance] bleConnectToDeviceWithId:identifier]) {
    self.connectBLEDeviceAsyncResolveBlock = resolve;
    self.connectBLEDeviceAsyncRejectBlock = reject;
  } else {
    NSError * error = [NSError errorWithDomain:@"fit.car.iOSSDK.BLE" code:1 userInfo:nil];
    reject(@"BLEDeviceConnectionFailed", @"Invalid device reference", error);
  }
#endif
}

RCT_EXPORT_METHOD(onBoardVehicleWithPlate:(NSString *) licensePlate
                  plateRegion:(NSString *) region
                  vinLastSix:(NSString *) lastSix
                  connectBLEDeviceResolver:(RCTPromiseResolveBlock)resolve
                  connectBLEDeviceRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] onBoardVehicleWithPlate:licensePlate plateRegion:region vinLastSix:lastSix] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"onBoarding", task.error.localizedDescription, task.error);
    } else {
      resolve (task.result);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(onBoardVehicleWithVIN:(NSString *) vin
                  connectBLEDeviceResolver:(RCTPromiseResolveBlock)resolve
                  connectBLEDeviceRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] onBoardVehicleWithVIN:vin] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"onBoarding", task.error.localizedDescription, task.error);
    } else {
      resolve (task.result);
    }
    return nil;
  }];
}

RCT_REMAP_METHOD(authenticateAuth0, authenticate:(NSString *) domain withToken:(NSDictionary *) token
                  authenticateLockResolver:(RCTPromiseResolveBlock)resolve
                  authenticateLockRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] authenticate:domain withTokens:token] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"authentication", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_REMAP_METHOD(authenticateNorauto, authenticate:(NSString *) code demographics:(NSDictionary *) demographics
                 authenticateLockResolver:(RCTPromiseResolveBlock)resolve
                 authenticateLockRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] authenticate:code demographics:demographics] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"authentication", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_REMAP_METHOD(clickButton,
                 clickButtonResolver:(RCTPromiseResolveBlock)resolve
                 clickButtonRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] appPushButton] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"appPushButton", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

// get firmware version

#pragma RCTEventEmitter

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"BLEDeviceConnectionStatus"
           , @"BLEButtonPress"
           , @"BLEButtonResponse"
           , @"TripMetersTraveled"
           , @"TripStartOfTravel"
           , @"TripEndOfTravel"
           , @"TripSteeringWheelAngle"
           , @"TripVehicleMetersPerSecond"
           , @"BLEOADNotification"
           ];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
  hasRCTListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasRCTListeners = NO;
}

#pragma AWS iOS SDK React Bridge

RCT_EXPORT_METHOD(backlogVinTypeGet:(NSString *) type vin:(NSString *) vin
  backlogVinGetResolver:(RCTPromiseResolveBlock)resolve
  backlogVinGetRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] backlogVinTypeGet:type vin:vin] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"backlogVinTypeGeterror", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(vehicleVinGet:(NSString *) vin
  vehicleVinGetResolver:(RCTPromiseResolveBlock)resolve
  vehicleVinGetRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] vehicleVinGet:vin] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"vehicleGeterror", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(tripLogVinGet:(NSString *) vin
  tripLogVinGetResolver:(RCTPromiseResolveBlock)resolve
  tripLogVinGetRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] tripLogVinGet:vin] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"tripLogGeterror", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(vehicleVinPut:(NSString *) vin vehicleDetails:(NSDictionary *)vehicleDetails
  vehicleVinPutResolver:(RCTPromiseResolveBlock)resolve
  vehicleVinPutRejecter:(RCTPromiseRejectBlock)reject)
{
  [[[CFPCore sharedInstance] vehicleVinPut:vin vehicleDetails:vehicleDetails] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"vehiclePuterror", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_REMAP_METHOD(userGet,
                  userGetResolver:(RCTPromiseResolveBlock)resolve
                  userGetRejecter:(RCTPromiseRejectBlock)reject) {
  [[[CFPCore sharedInstance] userGet] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {

    if (task.error) {
      reject(@"userGeterror", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(vehicleImageGet:(NSString *) fileName
                  vehicleImageGetResolver:(RCTPromiseResolveBlock) resolve
                  vehicelImageGetReject:(RCTPromiseRejectBlock) reject) {

  [[[CFPCore sharedInstance] vehicleImageGet:fileName] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"vehicleImageGetError", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(vehicleImagePut:(NSString *) imagePath file:(NSString *) fileName
                  vehicleImagePutResolver:(RCTPromiseResolveBlock) resolve
                  vehicelImagePutReject:(RCTPromiseRejectBlock) reject) {

  [[[CFPCore sharedInstance] vehicleImagePut:imagePath file:fileName] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
    if (task.error) {
      reject(@"vehicleImageGetError", task.error.localizedDescription, task.error);
    } else {
      resolve(task.result);
    }
    return nil;
  }];
}

@end
