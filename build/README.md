This folder is where the built UI will go.

Without this folder, `cargo clippy` will not compile the app.
Since we run clippy each commit using CI, this file will make sure the `build` folder exists.
