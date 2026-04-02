// Do not use window_vibrancy::apply_vibrancy — it prevents WKWebView from painting.
// Keep `transparent: false` on macOS: transparent + private API often yields a blank webview.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
