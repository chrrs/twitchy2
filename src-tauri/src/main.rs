#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, WindowEvent};

fn main() {
    tauri::Builder::default()
        .on_page_load(|window, payload| {
            if window.label() != "login" {
                return;
            }

            let url = payload.url();

            if !payload
                .url()
                .starts_with("https://slaghoedje.github.io/twitchy2")
            {
                return;
            }

            let token = url
                .find("#access_token=")
                .map(|i| &url[i + 14..])
                .map(|args| args.find('&').map(|i| &args[..i]).unwrap_or(args));

            if let Some(token) = token {
                window
                    .emit_all("token", token)
                    .expect("failed to emit token");
            }
        })
        .on_window_event(|event| {
            if event.window().label() != "login" {
                return;
            }

            if let WindowEvent::CloseRequested = event.event() {
                event
                    .window()
                    .emit_all("login-cancelled", ())
                    .expect("failed to emit login cancel event");
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
