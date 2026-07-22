package com.prasadm11.melodysaavan;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private static MainActivity instance = null;

    public static MainActivity getInstance() {
        return instance;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        instance = this;

        // Register custom JS Interface on the web view
        try {
            getBridge().getWebView().addJavascriptInterface(new Object() {
                @android.webkit.JavascriptInterface
                public void initBridge() {
                    Log.d(TAG, "NativeMediaSessionBridge.initBridge called");
                    try {
                        Intent intent = new Intent(MainActivity.this, MediaSessionService.class);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            startForegroundService(intent);
                        } else {
                            startService(intent);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error starting MediaSessionService", e);
                    }
                }

                @android.webkit.JavascriptInterface
                public void updateMetadata(String title, String artist, String album, String imageUrl, long duration) {
                    Log.d(TAG, "NativeMediaSessionBridge.updateMetadata: " + title + ", dur=" + duration);
                    MediaSessionService service = MediaSessionService.getInstance();
                    if (service != null) {
                        service.updateMetadata(title, artist, album, imageUrl, duration);
                    } else {
                        startServiceAndRun(() -> {
                            MediaSessionService s = MediaSessionService.getInstance();
                            if (s != null) {
                                s.updateMetadata(title, artist, album, imageUrl, duration);
                            }
                        });
                    }
                }

                @android.webkit.JavascriptInterface
                public void updatePlaybackState(boolean isPlaying, long position, long duration) {
                    Log.d(TAG, "NativeMediaSessionBridge.updatePlaybackState: " + isPlaying + ", pos=" + position + ", dur=" + duration);
                    MediaSessionService service = MediaSessionService.getInstance();
                    if (service != null) {
                        service.updatePlaybackState(isPlaying, position, duration);
                    } else {
                        startServiceAndRun(() -> {
                            MediaSessionService s = MediaSessionService.getInstance();
                            if (s != null) {
                                s.updatePlaybackState(isPlaying, position, duration);
                            }
                        });
                    }
                }

                @android.webkit.JavascriptInterface
                public void requestNotificationPermission() {
                    Log.d(TAG, "NativeMediaSessionBridge.requestNotificationPermission called");
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                            requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 1001);
                        }
                    }
                }
            }, "NativeMediaSessionBridge");
            Log.d(TAG, "NativeMediaSessionBridge successfully registered on WebView");
        } catch (Exception e) {
            Log.e(TAG, "Failed to register NativeMediaSessionBridge on WebView", e);
        }
    }

    private void startServiceAndRun(Runnable runnable) {
        try {
            Intent intent = new Intent(this, MediaSessionService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(runnable, 200);
        } catch (Exception e) {
            Log.e(TAG, "Error in startServiceAndRun", e);
        }
    }

    public void sendEventToWeb(String eventName, String dataJson) {
        runOnUiThread(() -> {
            try {
                String js = "window.dispatchEvent(new CustomEvent('nativeMediaSessionEvent', { detail: { event: '" + eventName + "', data: " + (dataJson != null ? dataJson : "{}") + " } }));";
                getBridge().getWebView().evaluateJavascript(js, null);
            } catch (Exception e) {
                Log.e(TAG, "Error evaluating JS in WebView: " + e.getMessage());
            }
        });
    }

    @Override
    public void onDestroy() {
        instance = null;
        super.onDestroy();
    }
}