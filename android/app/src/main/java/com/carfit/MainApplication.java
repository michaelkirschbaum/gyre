package com.carfit;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.amazonaws.reactnative.lambda.AWSRNLambdaPackage;
import com.amazonaws.reactnative.core.AWSRNCorePackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.auth0.lock.react.LockReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AWSRNLambdaPackage(),
            new AWSRNCorePackage(),
            new RCTCameraPackage(),
            new LockReactPackage(),
            new VectorIconsPackage(),
            new CarFitPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
