# 1.17.0
- Added `stdin` API.
- Writed better `calc` command.
- Added `-i` and `-nw` flags for `go`, `open` and `search` commands.
- Added `"system"` option for theme setting.
- Added `todo` and `test` modules.
- Maked little changes on colors.
- Moved `wttr.in` command to modules.

# 1.16.6
- TDK module deprecated.
- Added `click to execute command` button system.

    Usage:
    ```html
    <span class="exec-cmd" command="echo Hello, World!" >Click me!</span>
    ```
- Added `writeLikeCommandInput` and `commandPrefix` arguments to `execute` function.

# 1.16.5
- Fixed `allowMultiLines` system. (Read line 638 in `src/scripts/index.js` file for example.)
- The time-out requirement has been removed for `request` function.
- Moved `Fira Code` font to themes.
- Added `escapeUnsafeHTML` function for `stdout.startProcess`.

# 1.16.4
- Added <kbd><kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>L</kbd></kbd> support for clear console with history.

# 1.16.3
- Simple optimizations.

# 1.16.2
- Fixed <kbd><kbd>CTRL</kbd> + <kbd>L</kbd></kbd> support for clear console.

# 1.16.1
- Added <kbd><kbd>CTRL</kbd> + <kbd>L</kbd></kbd> support for clear console.

# 1.16.0
- Fixed history system.
- Removed comment support for `manifest.json` file.
- Added process history system.

# 1.15.0
- All option names casing in `manifest.json` file changed to `snake_case`.
- Added <ins>**one line comment**</ins> (`// ...`) support for `manifest.json`.
- Added scrollbar.
- Added new 2 wallpaper.

# 1.14.2
- Little fix for `cat` command.

# 1.14.1
- Little fix for auto complete system.

# 1.14.0
- Little fix for auto complete system.
- Added asynchronous check for updates system on load.

# 1.13.6
- Fixed auto complete support for commands. (Again.)

# 1.13.5
- Fixed auto complete support for commands.

# 1.13.4
- Added auto complete support for commands. (Read 381th line of `./src/scripts/index.js` for example.)

# 1.13.3
- Little fix for auto complete system. (Sorry again.)

# 1.13.2
- Little fix for auto complete system. (Sorry.)

# 1.13.1
- Little fix for auto complete system.

# 1.13.0
- Added auto complete system.

# 1.12.3
- Simple DOM system changes.

# 1.12.2
- Added `beforeExit` system for commands. (Read 370th line of `/src/scripts/index.js`)

# 1.12.1
- Fixed focus blocking system to elements inside the `#std-out` element.

# 1.12.0
- Updated `stdout` api for new `stdout.clearProcessOut` function.
- Removed space replacing for module names system. (`"chack for updates" != "check-for-updates"`)
- Added `checkForUpdates` command with `modules/check-for-updates.js` module.
- Edited `src/load.sh` file.
- Added focus blocking system to elements inside the `#std-out` element.

# 1.11.0
- Added "`enable_terminal_like_copy_paste`" setting system for `manifest.json`.

# 1.10.3
- Chanaged default tab mode for `go` command to `_blank`.

# 1.10.2
- Little fix for `open` command (`src/scripts/index.js` ln:`729`)

# 1.10.1
- Little fix for module system. (`src/scripts/index.js` ln:`999`)
- Chanaged default tab mode for `search` command to `_blank`.

# 1.10.0
- Added `simpleArgs` to `process` api.
- Fixed std-in system.

# 1.9.0
- Added `blink`, `rapid-blink`, `overline`, `hidden` and `strike` support for ansi escape codes.
- Added new features to `colorama.js` file.

# 1.8.3
- Removed `ipinfo` command.
- Fixed alias not found problem.

# 1.8.2
- Updated `request` and `stdout.error` functions.

# 1.8.1
- Fixed scrolling on click to any point.
- Fixed <kbd>**Home**</kbd> and <kbd>**End**</kbd> buttons system.

# 1.8.0
- Added module system.
- Fixed stdout class `write` and `error` functions.
- Added <kbd>**Home**</kbd> and <kbd>**End**</kbd> buttons system.

# 1.7.0

- Added `sengs` command.
- Added timeout for requests.
- Chanaged `openurl` command name to `open`.
- Added favicon.

# 1.6.0

- Created `readme.md` file.
- Chanaged some default aliases to optional.
- Added custom search engine system to `search` command.
- Added custom theme css file system for `manifest.json` file.
- Added custom favicon system for `manifest.json` file.
- Renamed default bookmarks.

# 1.5.0

- Added `start` command. (Works with custom URL Protocol.)
- Fixed history algortym. (Maybe.)
- Added remember history option to manifest.json for remember history algortym.
- Added remember history algortym. (Works with site local storage.)
- Added `--all` flag to `clear` command. (Use `help clear` for more information.)

# 1.4.2

- Updated `time` command.
- Added `timeHours` option to `manifest.json` file.

# 1.4.1

- `load.sh` file fixed.

# 1.4.0

- Chanaged files layout.
- Added `javascirpt` command.
- Edited light theme colors.
- Added more theme options.
- Added more wallpapers for background.

# 1.3.0

- Upgraded `echo`, `calc`, `tdk` and `help` commands.
- Added `cat`, `reload`, `close` and `sh` commands.
- Added std input algortym.

# 1.2.8

- Fixed `open` commands `-s` flag.

# 1.2.7

- Writed better help algortym.

# 1.2.6

- Renamed `./src/scripts/script.js` file to `./src/scripts/index.js`.
- Added effective time option to manifes.json.
- Added added `--set` and `--kill` flags to `time` command.
- Added better information for `time` command.

# 1.2.5

- Added `format` argument for `stdout` functions.

# 1.2.4

- Added `@echo` command.

# 1.2.3

- Added `ipinfo` command.

# 1.2.2

- Fixed breaking on send empty command.

# 1.2.1

- Added `openurl`, `bookmarks` and `about` commands.

# 1.2.0

- Added `bash` command.
- Added `execute` and `executeScript` functions.
- Added on load script.

# 1.1.1

- Added `echo` command
- Added focus on load system.
- Added copy with <kbd>Enter</kbd> key.
- Added paste with right click.

# 1.1.0

- Added `time`, `date`, `calc` and `tdk` commands.
- Added temporal history algorithm.

# 1.0.1

- Added `test`, `go`, `help`, `clear`, `wttr.in` and `search` commands.
- Added "Fira Code" font family.
- Added [ansi_up@5.2.1](https://www.npmjs.com/package/ansi_up/v/5.2.1) module.

# 1.0.0

- Started project.