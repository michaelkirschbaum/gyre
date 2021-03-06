/*
  CarFitPackage.java

  Register CarFitManager
*/

package com.carfit;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.toast.ToastModule;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by max on 3/7/17.
 */
class CarFitPackage implements ReactPackage
    {


    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext)
        {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new CarFitManager(reactContext));

        return modules;
        }
    }
