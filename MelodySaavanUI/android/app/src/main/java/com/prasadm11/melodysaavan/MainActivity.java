package com.prasadm11.melodysaavan;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONArray;
import org.json.JSONObject;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private static MainActivity instance = null;
    private final ExecutorService downloadExecutor = Executors.newFixedThreadPool(3);
    private SpeechRecognizer speechRecognizer = null;

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

                @android.webkit.JavascriptInterface
                public boolean hasRecordAudioPermission() {
                    Log.d(TAG, "NativeMediaSessionBridge.hasRecordAudioPermission called");
                    return checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
                }

                @android.webkit.JavascriptInterface
                public void requestRecordAudioPermission() {
                    Log.d(TAG, "NativeMediaSessionBridge.requestRecordAudioPermission called");
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        requestPermissions(new String[]{android.Manifest.permission.RECORD_AUDIO}, 1002);
                    }
                }

                @android.webkit.JavascriptInterface
                public void startSpeechRecognition() {
                    Log.d(TAG, "NativeMediaSessionBridge.startSpeechRecognition called");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                if (speechRecognizer == null) {
                                    speechRecognizer = SpeechRecognizer.createSpeechRecognizer(MainActivity.this);
                                    speechRecognizer.setRecognitionListener(new RecognitionListener() {
                                        @Override
                                        public void onReadyForSpeech(Bundle params) {
                                            sendEventToWeb("speech_started", null);
                                        }

                                        @Override
                                        public void onBeginningOfSpeech() {
                                            sendEventToWeb("speech_started", null);
                                        }

                                        @Override
                                        public void onRmsChanged(float rmsdB) {}

                                        @Override
                                        public void onBufferReceived(byte[] buffer) {}

                                        @Override
                                        public void onEndOfSpeech() {
                                            sendEventToWeb("speech_ended", null);
                                        }

                                        @Override
                                        public void onError(int error) {
                                            String message;
                                            String type = "error";
                                            switch (error) {
                                                case SpeechRecognizer.ERROR_AUDIO: message = "Audio recording error"; break;
                                                case SpeechRecognizer.ERROR_CLIENT: message = "Client side error"; break;
                                                case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                                                    message = "Insufficient permissions";
                                                    type = "permission_denied";
                                                    break;
                                                case SpeechRecognizer.ERROR_NETWORK: message = "Network error"; break;
                                                case SpeechRecognizer.ERROR_NETWORK_TIMEOUT: message = "Network timeout"; break;
                                                case SpeechRecognizer.ERROR_NO_MATCH:
                                                    message = "No speech match found";
                                                    type = "no_speech";
                                                    break;
                                                case SpeechRecognizer.ERROR_RECOGNIZER_BUSY: message = "Recognition service busy"; break;
                                                case SpeechRecognizer.ERROR_SERVER: message = "Server error"; break;
                                                case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                                                    message = "No speech input";
                                                    type = "no_speech";
                                                    break;
                                                default: message = "Unknown speech error"; break;
                                            }
                                            try {
                                                JSONObject errData = new JSONObject();
                                                errData.put("message", message);
                                                errData.put("type", type);
                                                sendEventToWeb("speech_error", errData.toString());
                                            } catch (Exception e) {
                                                Log.e(TAG, "Error sending speech error event", e);
                                            }
                                        }

                                        @Override
                                        public void onResults(Bundle results) {
                                            java.util.ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                                            if (matches != null && matches.size() > 0) {
                                                String resultText = matches.get(0);
                                                try {
                                                    JSONObject resData = new JSONObject();
                                                    resData.put("text", resultText);
                                                    sendEventToWeb("speech_result", resData.toString());
                                                } catch (Exception e) {
                                                    Log.e(TAG, "Error sending speech result event", e);
                                                }
                                            } else {
                                                try {
                                                    JSONObject errData = new JSONObject();
                                                    errData.put("message", "No speech match found");
                                                    errData.put("type", "no_speech");
                                                    sendEventToWeb("speech_error", errData.toString());
                                                } catch (Exception e) {}
                                            }
                                        }

                                        @Override
                                        public void onPartialResults(Bundle partialResults) {}

                                        @Override
                                        public void onEvent(int eventType, Bundle params) {}
                                    });
                                }

                                Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US");
                                intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
                                speechRecognizer.startListening(intent);
                            } catch (Exception e) {
                                Log.e(TAG, "Error starting speech recognition", e);
                                try {
                                    JSONObject errData = new JSONObject();
                                    errData.put("message", e.getMessage());
                                    errData.put("type", "error");
                                    sendEventToWeb("speech_error", errData.toString());
                                } catch (Exception ex) {}
                            }
                        }
                    });
                }

                @android.webkit.JavascriptInterface
                public void stopSpeechRecognition() {
                    Log.d(TAG, "NativeMediaSessionBridge.stopSpeechRecognition called");
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                if (speechRecognizer != null) {
                                    speechRecognizer.stopListening();
                                }
                            } catch (Exception e) {
                                Log.e(TAG, "Error stopping speech recognition", e);
                            }
                        }
                    });
                }
            }, "NativeMediaSessionBridge");
            Log.d(TAG, "NativeMediaSessionBridge successfully registered on WebView");

            getBridge().getWebView().addJavascriptInterface(new Object() {
                @android.webkit.JavascriptInterface
                public void downloadSong(String songId, String songJson, String mediaUrl) {
                    Log.d(TAG, "NativeDownloadBridge.downloadSong called for: " + songId);
                    MainActivity.this.startSongDownload(songId, songJson, mediaUrl);
                }

                @android.webkit.JavascriptInterface
                public String getDownloadedSongs() {
                    Log.d(TAG, "NativeDownloadBridge.getDownloadedSongs called");
                    return MainActivity.this.getDownloadedSongsList();
                }

                @android.webkit.JavascriptInterface
                public boolean deleteSong(String songId) {
                    Log.d(TAG, "NativeDownloadBridge.deleteSong called for: " + songId);
                    return MainActivity.this.deleteDownloadedSongFile(songId);
                }
            }, "NativeDownloadBridge");
            Log.d(TAG, "NativeDownloadBridge successfully registered on WebView");
        } catch (Exception e) {
            Log.e(TAG, "Failed to register Javascript Interfaces on WebView", e);
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

    private void startSongDownload(final String songId, final String songJson, final String mediaUrl) {
        downloadExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    // 1. Create downloads folder
                    File downloadsDir = new File(getExternalFilesDir(null), "downloads");
                    if (!downloadsDir.exists()) {
                        downloadsDir.mkdirs();
                    }

                    // 2. Prepare target file path
                    File outputFile = new File(downloadsDir, songId + ".m4a");
                    String localPath = outputFile.getAbsolutePath();

                    // Notify start
                    JSONObject startData = new JSONObject();
                    startData.put("songId", songId);
                    sendEventToWeb("download_started", startData.toString());

                    // 3. Perform HTTP download
                    URL url = new URL(mediaUrl);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.connect();

                    if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                        throw new Exception("Server returned HTTP " + connection.getResponseCode() + " " + connection.getResponseMessage());
                    }

                    int fileLength = connection.getContentLength();
                    InputStream input = new BufferedInputStream(connection.getInputStream(), 8192);
                    FileOutputStream output = new FileOutputStream(outputFile);

                    byte data[] = new byte[4096];
                    long total = 0;
                    int count;
                    long lastProgressTime = 0;

                    while ((count = input.read(data)) != -1) {
                        total += count;
                        output.write(data, 0, count);

                        // Throttle progress events to avoid flooding WebView
                        long currentTime = System.currentTimeMillis();
                        if (fileLength > 0 && (currentTime - lastProgressTime > 300)) {
                            lastProgressTime = currentTime;
                            int progress = (int) (total * 100 / fileLength);
                            JSONObject progressData = new JSONObject();
                            progressData.put("songId", songId);
                            progressData.put("progress", progress);
                            sendEventToWeb("download_progress", progressData.toString());
                        }
                    }

                    output.flush();
                    output.close();
                    input.close();

                    // 4. Update downloads.json metadata registry
                    File registryFile = new File(downloadsDir, "downloads.json");
                    JSONArray downloadsArray = new JSONArray();

                    if (registryFile.exists()) {
                        try {
                            BufferedInputStream regInput = new BufferedInputStream(new java.io.FileInputStream(registryFile));
                            byte[] buffer = new byte[(int) registryFile.length()];
                            regInput.read(buffer);
                            regInput.close();
                            String regContent = new String(buffer, "UTF-8");
                            downloadsArray = new JSONArray(regContent);
                        } catch (Exception e) {
                            Log.e(TAG, "Error reading downloads.json", e);
                        }
                    }

                    // Check if song already exists in downloads.json and remove duplicate
                    int existingIndex = -1;
                    for (int i = 0; i < downloadsArray.length(); i++) {
                        JSONObject obj = downloadsArray.getJSONObject(i);
                        if (obj.optString("id").equals(songId)) {
                            existingIndex = i;
                            break;
                        }
                    }

                    JSONObject songObj = new JSONObject(songJson);
                    songObj.put("localPath", localPath);

                    // Download artwork image
                    String imageUrl = songObj.optString("image");
                    if (imageUrl != null && !imageUrl.isEmpty()) {
                        // Request high quality 500x500 version for offline storage
                        imageUrl = imageUrl.replace("150x150", "500x500").replace("50x50", "500x500");
                        try {
                            File artFile = new File(downloadsDir, songId + ".jpg");
                            URL imgUrl = new URL(imageUrl);
                            HttpURLConnection imgConnection = (HttpURLConnection) imgUrl.openConnection();
                            imgConnection.connect();
                            if (imgConnection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                                InputStream imgInput = new BufferedInputStream(imgConnection.getInputStream(), 8192);
                                FileOutputStream imgOutput = new FileOutputStream(artFile);
                                byte imgData[] = new byte[4096];
                                int imgCount;
                                while ((imgCount = imgInput.read(imgData)) != -1) {
                                    imgOutput.write(imgData, 0, imgCount);
                                }
                                imgOutput.flush();
                                imgOutput.close();
                                imgInput.close();
                                songObj.put("localImage", artFile.getAbsolutePath());
                            } else {
                                // Try original url if high res failed
                                Log.w(TAG, "High-res artwork failed, trying fallback: " + songObj.optString("image"));
                                URL fallbackUrl = new URL(songObj.optString("image"));
                                HttpURLConnection fallbackConn = (HttpURLConnection) fallbackUrl.openConnection();
                                fallbackConn.connect();
                                if (fallbackConn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                                    InputStream imgInput = new BufferedInputStream(fallbackConn.getInputStream(), 8192);
                                    FileOutputStream imgOutput = new FileOutputStream(artFile);
                                    byte imgData[] = new byte[4096];
                                    int imgCount;
                                    while ((imgCount = imgInput.read(imgData)) != -1) {
                                        imgOutput.write(imgData, 0, imgCount);
                                    }
                                    imgOutput.flush();
                                    imgOutput.close();
                                    imgInput.close();
                                    songObj.put("localImage", artFile.getAbsolutePath());
                                }
                            }
                        } catch (Exception e) {
                            Log.e(TAG, "Failed to download artwork for " + songId, e);
                        }
                    }

                    if (existingIndex != -1) {
                        downloadsArray.put(existingIndex, songObj);
                    } else {
                        downloadsArray.put(songObj);
                    }

                    // Save downloads.json back
                    FileOutputStream regOutput = new FileOutputStream(registryFile);
                    regOutput.write(downloadsArray.toString().getBytes("UTF-8"));
                    regOutput.flush();
                    regOutput.close();

                    // Notify completion
                    JSONObject completeData = new JSONObject();
                    completeData.put("songId", songId);
                    completeData.put("localPath", localPath);
                    if (songObj.has("localImage")) {
                        completeData.put("localImage", songObj.getString("localImage"));
                    }
                    sendEventToWeb("download_completed", completeData.toString());

                } catch (Exception e) {
                    Log.e(TAG, "Download failed for " + songId, e);
                    try {
                        JSONObject errorData = new JSONObject();
                        errorData.put("songId", songId);
                        errorData.put("error", e.getMessage());
                        sendEventToWeb("download_failed", errorData.toString());
                    } catch (Exception ex) {
                        Log.e(TAG, "Error sending failure event", ex);
                    }
                }
            }
        });
    }

    private String getDownloadedSongsList() {
        try {
            File downloadsDir = new File(getExternalFilesDir(null), "downloads");
            File registryFile = new File(downloadsDir, "downloads.json");
            if (!registryFile.exists()) {
                return "[]";
            }
            BufferedInputStream regInput = new BufferedInputStream(new java.io.FileInputStream(registryFile));
            byte[] buffer = new byte[(int) registryFile.length()];
            regInput.read(buffer);
            regInput.close();
            return new String(buffer, "UTF-8");
        } catch (Exception e) {
            Log.e(TAG, "Error reading downloads list", e);
            return "[]";
        }
    }

    private boolean deleteDownloadedSongFile(String songId) {
        try {
            File downloadsDir = new File(getExternalFilesDir(null), "downloads");
            
            // Delete audio file
            File outputFile = new File(downloadsDir, songId + ".m4a");
            boolean fileDeleted = false;
            if (outputFile.exists()) {
                fileDeleted = outputFile.delete();
            }

            // Delete artwork file
            File artFile = new File(downloadsDir, songId + ".jpg");
            if (artFile.exists()) {
                artFile.delete();
            }

            // Remove from downloads.json
            File registryFile = new File(downloadsDir, "downloads.json");
            if (registryFile.exists()) {
                JSONArray downloadsArray = new JSONArray();
                try {
                    BufferedInputStream regInput = new BufferedInputStream(new java.io.FileInputStream(registryFile));
                    byte[] buffer = new byte[(int) registryFile.length()];
                    regInput.read(buffer);
                    regInput.close();
                    String regContent = new String(buffer, "UTF-8");
                    downloadsArray = new JSONArray(regContent);
                } catch (Exception e) {
                    Log.e(TAG, "Error parsing downloads.json during delete", e);
                }

                JSONArray updatedArray = new JSONArray();
                for (int i = 0; i < downloadsArray.length(); i++) {
                    JSONObject obj = downloadsArray.getJSONObject(i);
                    if (!obj.optString("id").equals(songId)) {
                        updatedArray.put(obj);
                    }
                }

                FileOutputStream regOutput = new FileOutputStream(registryFile);
                regOutput.write(updatedArray.toString().getBytes("UTF-8"));
                regOutput.flush();
                regOutput.close();
            }
            return fileDeleted;
        } catch (Exception e) {
            Log.e(TAG, "Error deleting downloaded song: " + songId, e);
            return false;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1002) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            try {
                JSONObject data = new JSONObject();
                data.put("permission", "record_audio");
                data.put("granted", granted);
                sendEventToWeb("permission_result", data.toString());
            } catch (Exception e) {
                Log.e(TAG, "Error sending permission result event", e);
            }
        }
    }

    @Override
    public void onDestroy() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (speechRecognizer != null) {
                    speechRecognizer.destroy();
                    speechRecognizer = null;
                }
            }
        });
        instance = null;
        super.onDestroy();
    }
}