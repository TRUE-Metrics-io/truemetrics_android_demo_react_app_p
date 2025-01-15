package io.truemetrics.rn.demo;

import android.app.Notification;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationChannelCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.truemetrics.truemetricssdk.ErrorCode;
import io.truemetrics.truemetricssdk.StatusListener;
import io.truemetrics.truemetricssdk.TruemetricsSDK;
import io.truemetrics.truemetricssdk.config.Config;
import io.truemetrics.truemetricssdk.engine.state.State;

import com.facebook.react.bridge.UiThreadUtil;

public class TruemetricsSdkModule extends ReactContextBaseJavaModule {

    private static final String TAG = "TruemetricsSdkModule";

    TruemetricsSdkModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "TruemetricsSdkModule";
    }

    @ReactMethod
    public void initializeSdk(String apiKey) {
        Log.d(TAG, "initializeSdk apiKey=" + apiKey);

        UiThreadUtil.runOnUiThread(() -> {

            NotificationManagerCompat notifManager = NotificationManagerCompat.from(getReactApplicationContext());

            notifManager.createNotificationChannel(
                    new NotificationChannelCompat.Builder("FOREGROUND_SERVICE_CHANNEL", NotificationManagerCompat.IMPORTANCE_LOW)
                            .setName("Foreground service")
                            .setShowBadge(false)
                            .build()
            );

            Notification notif = new NotificationCompat.Builder(getReactApplicationContext(), "FOREGROUND_SERVICE_CHANNEL")
                    .setContentTitle("Foreground service")
                    .setSmallIcon(R.drawable.ic_notification_logo)
                    .setOngoing(true)
                    .build();

            Config config = new Config(apiKey, notif, true);

            TruemetricsSDK.setStatusListener(new StatusListener() {
                @Override
                public void onStateChange(@NonNull State state) {
                    Log.d(TAG, "onStateChange state=" + state);
                    sendSdkStateChangedEvent(state.name());
                }

                @Override
                public void onError(@NonNull ErrorCode errorCode, @Nullable String message) {
                    Log.d(TAG, "onError errorCode=" + errorCode+" message="+message);
                    sendSdkErrorEvent(errorCode.name()+":"+message);
                }

                @Override
                public void askPermissions(@NonNull List<String> list) {
                    Log.d(TAG, "askPermissions list=" + list);
                    sendSdkPermissionsEvent(list);
                }
            });

            TruemetricsSDK.initialize(getReactApplicationContext(), config);
        });
    };

    @ReactMethod
    public void startRecording() {
        TruemetricsSDK.startRecording();
    }

    @ReactMethod
    public void stopRecording() {
        TruemetricsSDK.stopRecording();
    }

    @ReactMethod
    public void logMetadata(ReadableMap readableMap) {
        Map<String, String> params = new HashMap<>();
        params.put(readableMap.getString("key"), readableMap.getString("value"));
         Log.d(TAG, "askPermissilogMetadataons params=" + params);
        TruemetricsSDK.logMetadata(params);
    }

    private void sendSdkStateChangedEvent(String newState) {
        WritableMap params = Arguments.createMap();
        params.putString("newState", newState);

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("SDK_STATE", params);
    }

    private void sendSdkPermissionsEvent(List<String> permissions) {
        WritableArray array = new WritableNativeArray();

        for(String permission : permissions) {
            array.pushString(permission);
        }

        WritableMap params = Arguments.createMap();
        params.putArray("permissions", array);

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("SDK_PERMISSIONS", params);
    }

    private void sendSdkErrorEvent(String error) {
        WritableMap params = Arguments.createMap();
        params.putString("error", error);

        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("SDK_ERROR", params);
    }
}


