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