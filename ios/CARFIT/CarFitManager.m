//
//  CarFitManager.m
//  CARFIT
//
//  Created by Chris McClenaghan on 1/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CarFitManager.h"
#import <React/RCTlog.h>

@implementation CarFitManager

- (instancetype) init {
  self = [super init];
  if (self) {
    NSLog(@"%s - init success\n", __FUNCTION__);
    [self start];
  };
  return self;
}

#pragma BLE UI Callbacks

- (void) bleScanForDevices;
{
  [[CFPCore sharedInstance] bleScanForDevices];
}

- (NSUInteger) bleDeviceCount {
  return [[CFPCore sharedInstance] bleDiscoveredDevices].count;
}

- (NSDictionary *) getBLEDeviceDictionaryAt:(NSInteger) index {
  return [[CFPCore sharedInstance] bleDiscoveredDevices][index];
}

- (void) bleConnectToDeviceAt:(NSInteger)index {
  [[CFPCore sharedInstance] bleConnectToDeviceAt:index];
}

- (BOOL) bleDeviceConnected:(NSInteger)index {
  return [[CFPCore sharedInstance] bleDeviceConnected:index];
  
}

- (void) bleDisconnectDevice {
  [[CFPCore sharedInstance] bleDisconnectDevice];
}

- (BOOL) bleIsDeviceScanning {
  return [[CFPCore sharedInstance] bleIsDeviceScanning];
}

- (void) onBoardVehicle:(NSString *) vin emailAddress:(NSString *) email {
  [[CFPCore sharedInstance] onBoardVehicle: vin emailAddress:email];
}

- (NSString *) VIN {
  return [[CFPCore sharedInstance] VIN];
}

- (void) setPhone:(NSString *)phone {
  [[CFPCore sharedInstance] setPhone:phone];
}

- (void) start {
  [[CFPCore sharedInstance] start];
  [[CFPCore sharedInstance] bleScanForDevices];
}

#pragma Upload Counters API Gateway/S3

- (NSDictionary *) getUploadCounters {
  return [[CFPCore sharedInstance] getUploadCounters];
}

#pragma React Native Bridge

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(availableBLEDevicesAsync,
                 availableBLEDevicesResolver:(RCTPromiseResolveBlock)resolve
                 availableBLEDevicesRejecter:(RCTPromiseRejectBlock)reject)
{
#if TARGET_OS_SIMULATOR
  NSArray * devices = @[@{@"name": @"CARFIT", @"id": @"129AB20934" , @"signal": @80}];
#else
  NSArray * devices = [[CFPCore sharedInstance] bleDiscoveredDevices];
#endif
  if (devices) {
    resolve(devices);
  } else {
    NSError *error;
    reject(@"no_events", @"There were no events", error);
  }
}

RCT_EXPORT_METHOD(connectBLEDeviceAsync:(NSInteger) index
                 connectBLEDeviceResolver:(RCTPromiseResolveBlock)resolve
                 connectBLEDeviceRejecter:(RCTPromiseRejectBlock)reject)
{
  [[CFPCore sharedInstance] bleConnectToDeviceAt:index];
  resolve(nil);
}

@end