package com.komtechnologie.enginscan;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 1;

    @SuppressWarnings("deprecation")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);

        // Plein écran — setSystemUiVisibility deprecated en API 30 mais fonctionnel sur toutes les versions
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        );

        webView = new WebView(this);
        setContentView(webView);

        configureWebView();
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @SuppressLint({"SetJavaScriptEnabled", "ObsoleteSdkInt"})
    @SuppressWarnings("deprecation")
    private void configureWebView() {
        WebSettings settings = webView.getSettings();

        // Fonctionnalités de base
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Stockage de base de données WebSQL — deprecated en API 29, ignoré en API 30+
        if (Build.VERSION.SDK_INT < 29) {
            settings.setDatabaseEnabled(true);
        }

        // Accès fichiers locaux entre iframes — nécessaire pour les assets locaux
        // Deprecated en API 30 mais toujours fonctionnel ; sans cela les modules JS
        // chargés depuis file:///android_asset/ ne peuvent pas s'appeler mutuellement
        if (Build.VERSION.SDK_INT < 30) {
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
        }

        // Contenu mixte — deprecated en API 24 mais fonctionnel ; nécessaire pour
        // les polices Google Fonts chargées en HTTP depuis une page locale
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Navigation : liens externes vers le navigateur système
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;
                if (url.startsWith("file://") || url.startsWith("about:")) {
                    return false; // navigation locale
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    // Aucun navigateur disponible, on ignore
                }
                return true;
            }
        });

        // Chrome client : caméra, sélecteur de fichiers, console
        webView.setWebChromeClient(new WebChromeClient() {

            // Sélecteur de fichiers (caméra / galerie) — API 21+
            @Override
            public boolean onShowFileChooser(WebView webView,
                                              ValueCallback<Uri[]> fileCb,
                                              FileChooserParams params) {
                // Annuler toute sélection précédente en attente
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = fileCb;
                try {
                    startActivityForResult(params.createIntent(), FILE_CHOOSER_REQUEST_CODE);
                } catch (Exception e) {
                    filePathCallback = null;
                    return false;
                }
                return true;
            }

            // Permissions WebRTC (caméra, micro) — accordées automatiquement
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }

            // Suppression des logs JS en production
            @Override
            public boolean onConsoleMessage(ConsoleMessage msg) {
                return true;
            }
        });
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // onActivityResult deprecated en API 30 mais fonctionnel sur toutes versions
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                String dataString = data.getDataString();
                if (dataString != null) {
                    results = new Uri[]{ Uri.parse(dataString) };
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        // onBackPressed deprecated en API 33 mais fonctionnel sur toutes versions
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
