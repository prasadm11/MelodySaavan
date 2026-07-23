package com.prasadm11.melodysaavan;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import java.io.InputStream;
import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Executors;

public class MediaSessionService extends Service {
    private static final String TAG = "MediaSessionService";
    private static final String CHANNEL_ID = "melodysaavan_playback";
    private static final int NOTIFICATION_ID = 9012;

    public static final String ACTION_PLAY = "com.prasadm11.melodysaavan.ACTION_PLAY";
    public static final String ACTION_PAUSE = "com.prasadm11.melodysaavan.ACTION_PAUSE";
    public static final String ACTION_NEXT = "com.prasadm11.melodysaavan.ACTION_NEXT";
    public static final String ACTION_PREVIOUS = "com.prasadm11.melodysaavan.ACTION_PREVIOUS";
    public static final String ACTION_STOP = "com.prasadm11.melodysaavan.ACTION_STOP";

    private static MediaSessionService instance = null;

    private MediaSession mediaSession;
    private NotificationManager notificationManager;
    
    private String currentTitle = "MelodySaavan";
    private String currentArtist = "";
    private String currentAlbum = "";
    private String currentImageUrl = "";
    private Bitmap currentArtwork = null;
    private boolean isPlaying = false;
    private long currentPosition = 0;
    private long currentDuration = 0;

    public static MediaSessionService getInstance() {
        return instance;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        
        createNotificationChannel();
        initMediaSession();
        showInitialNotification();
    }

    private void initMediaSession() {
        mediaSession = new MediaSession(this, "MelodySaavanSession");
        mediaSession.setActive(true);
        mediaSession.setCallback(new MediaSession.Callback() {
            @Override
            public void onPlay() {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("play", null);
                }
            }

            @Override
            public void onPause() {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("pause", null);
                }
            }

            @Override
            public void onSkipToNext() {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("next", null);
                }
            }

            @Override
            public void onSkipToPrevious() {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("previous", null);
                }
            }

            @Override
            public void onSeekTo(long pos) {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("seekTo", "{\"position\":" + pos + "}");
                }
            }
        });

        updatePlaybackState(false, 0, 0);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.getAction() != null) {
            String action = intent.getAction();
            Log.d(TAG, "onStartCommand received action: " + action);
            if (ACTION_PLAY.equals(action)) {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("play", null);
                }
            } else if (ACTION_PAUSE.equals(action)) {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("pause", null);
                }
            } else if (ACTION_NEXT.equals(action)) {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("next", null);
                }
            } else if (ACTION_PREVIOUS.equals(action)) {
                if (MainActivity.getInstance() != null) {
                    MainActivity.getInstance().sendEventToWeb("previous", null);
                }
            } else if (ACTION_STOP.equals(action)) {
                cleanupAndStop();
            }
        }
        return START_NOT_STICKY;
    }

    private void cleanupAndStop() {
        Log.d(TAG, "Stopping service and cleaning up media session");
        isPlaying = false;
        if (mediaSession != null) {
            mediaSession.setActive(false);
        }
        stopForeground(true);
        stopSelf();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy called");
        cleanupAndStop();
        if (mediaSession != null) {
            mediaSession.release();
        }
        instance = null;
        super.onDestroy();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "MelodySaavan Playback",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Media controls for MelodySaavan");
            channel.setShowBadge(false);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    private void showInitialNotification() {
        Notification notification = buildNotification(null);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    public void updateMetadata(String title, String artist, String album, String imageUrl, long duration) {
        currentTitle = title != null && !title.isEmpty() ? title : "MelodySaavan";
        currentArtist = artist != null ? artist : "";
        currentAlbum = album != null ? album : "";
        if (duration > 0) {
            this.currentDuration = duration;
        }
        
        if (imageUrl != null && !imageUrl.equals(currentImageUrl)) {
            currentImageUrl = imageUrl;
            loadArtwork(imageUrl);
        } else {
            updateNotificationAndSession(currentArtwork);
        }
    }

    public void updatePlaybackState(boolean playing, long position, long duration) {
        this.isPlaying = playing;
        this.currentPosition = position;
        
        if (duration > 0 && duration != this.currentDuration) {
            this.currentDuration = duration;
            // Update metadata with the new duration
            updateNotificationAndSession(currentArtwork);
        }

        long actions = PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE |
                       PlaybackState.ACTION_SKIP_TO_NEXT | PlaybackState.ACTION_SKIP_TO_PREVIOUS |
                       PlaybackState.ACTION_SEEK_TO;

        PlaybackState.Builder stateBuilder = new PlaybackState.Builder()
            .setActions(actions)
            .setState(isPlaying ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED, currentPosition, 1.0f);
        
        if (mediaSession != null) {
            mediaSession.setPlaybackState(stateBuilder.build());
        }

        if (currentTitle != null) {
            Notification notification = buildNotification(currentArtwork);
            if (isPlaying) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
                } else {
                    startForeground(NOTIFICATION_ID, notification);
                }
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    stopForeground(STOP_FOREGROUND_DETACH);
                } else {
                    stopForeground(false);
                }
                if (notificationManager != null) {
                    notificationManager.notify(NOTIFICATION_ID, notification);
                }
            }
        }
    }

    private void updateNotificationAndSession(Bitmap artwork) {
        currentArtwork = artwork;
        
        MediaMetadata.Builder metadataBuilder = new MediaMetadata.Builder()
            .putString(MediaMetadata.METADATA_KEY_TITLE, currentTitle)
            .putString(MediaMetadata.METADATA_KEY_ARTIST, currentArtist)
            .putString(MediaMetadata.METADATA_KEY_ALBUM, currentAlbum);
        
        if (currentDuration > 0) {
            metadataBuilder.putLong(MediaMetadata.METADATA_KEY_DURATION, currentDuration);
        }
        
        if (artwork != null) {
            metadataBuilder.putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, artwork);
        }
        
        if (mediaSession != null) {
            mediaSession.setMetadata(metadataBuilder.build());
        }

        Notification notification = buildNotification(artwork);
        if (isPlaying) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
        } else {
            if (notificationManager != null) {
                notificationManager.notify(NOTIFICATION_ID, notification);
            }
        }
    }

    private void loadArtwork(final String urlString) {
        if (urlString == null || urlString.isEmpty()) {
            updateNotificationAndSession(null);
            return;
        }

        Executors.newSingleThreadExecutor().execute(() -> {
            Bitmap bitmap = null;
            try {
                if (urlString.startsWith("http://localhost/_capacitor_file_/") || urlString.startsWith("https://localhost/_capacitor_file_/")) {
                    String path = urlString.replace("http://localhost/_capacitor_file_/", "").replace("https://localhost/_capacitor_file_/", "");
                    File file = new File(path);
                    if (file.exists()) {
                        bitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
                    } else {
                        Log.e(TAG, "Local artwork file does not exist: " + path);
                    }
                } else if (urlString.startsWith("/")) {
                    File file = new File(urlString);
                    if (file.exists()) {
                        bitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
                    } else {
                        Log.e(TAG, "Local artwork file does not exist: " + urlString);
                    }
                } else {
                    URL url = new URL(urlString);
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setDoInput(true);
                    connection.connect();
                    InputStream input = connection.getInputStream();
                    bitmap = BitmapFactory.decodeStream(input);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error loading artwork: " + e.getMessage());
            }

            final Bitmap finalBitmap = bitmap;
            new Handler(Looper.getMainLooper()).post(() -> {
                if (urlString.equals(currentImageUrl)) {
                    updateNotificationAndSession(finalBitmap);
                }
            });
        });
    }

    private Notification buildNotification(Bitmap artwork) {
        PendingIntent prevIntent = getPendingIntent(ACTION_PREVIOUS);
        PendingIntent playPauseIntent = getPendingIntent(isPlaying ? ACTION_PAUSE : ACTION_PLAY);
        PendingIntent nextIntent = getPendingIntent(ACTION_NEXT);
        PendingIntent deleteIntent = getPendingIntent(ACTION_STOP);

        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder = new Notification.Builder(this, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(this);
        }

        int playPauseIcon = isPlaying ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play;

        builder.setContentTitle(currentTitle)
            .setContentText(currentArtist)
            .setSubText(currentAlbum)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentIntent(getMainActivityPendingIntent())
            .setDeleteIntent(deleteIntent)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .setOngoing(isPlaying);

        if (artwork != null) {
            builder.setLargeIcon(artwork);
        } else {
            Bitmap defaultIcon = BitmapFactory.decodeResource(getResources(), getApplicationInfo().icon);
            builder.setLargeIcon(defaultIcon);
        }

        builder.addAction(new Notification.Action.Builder(android.R.drawable.ic_media_previous, "Previous", prevIntent).build());
        builder.addAction(new Notification.Action.Builder(playPauseIcon, isPlaying ? "Pause" : "Play", playPauseIntent).build());
        builder.addAction(new Notification.Action.Builder(android.R.drawable.ic_media_next, "Next", nextIntent).build());

        Notification.MediaStyle mediaStyle = new Notification.MediaStyle()
            .setMediaSession(mediaSession.getSessionToken())
            .setShowActionsInCompactView(0, 1, 2);

        builder.setStyle(mediaStyle);

        return builder.build();
    }

    private PendingIntent getPendingIntent(String action) {
        Intent intent = new Intent(this, MediaSessionService.class);
        intent.setAction(action);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getService(this, action.hashCode(), intent, flags);
    }

    private PendingIntent getMainActivityPendingIntent() {
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return PendingIntent.getActivity(this, 0, intent, flags);
    }
}
