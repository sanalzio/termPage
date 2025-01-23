const Reset = "\x1b[0m";

const Fore = {
    Reset : "\x1b[39m",
    Bright : "\x1b[1m",
    Black : "\x1b[30m",
    Red : "\x1b[31m",
    Green : "\x1b[32m",
    Yellow : "\x1b[33m",
    Blue : "\x1b[34m",
    Magenta : "\x1b[35m",
    Cyan : "\x1b[36m",
    White : "\x1b[37m",
    Gray : "\x1b[90m",
    BrightRed : "\x1b[91m",
    BrightGreen : "\x1b[92m",
    BrightYellow : "\x1b[93m",
    BrightBlue : "\x1b[94m",
    BrightMagenta : "\x1b[95m",
    BrightCyan : "\x1b[96m",
    BrightWhite : "\x1b[97m",
    rgb : (r,g,b) => {
        return `\x1b[38;2;${r};${g};${b}m`;
    },
    Bit8 : n => {
        return `\x1b[38;5;${n}m`;
    }
}

const Back = {
    Reset : "\x1b[49m",
    BgBlack : "\x1b[40m",
    BgRed : "\x1b[41m",
    BgGreen : "\x1b[42m",
    BgYellow : "\x1b[43m",
    BgBlue : "\x1b[44m",
    BgMagenta : "\x1b[45m",
    BgCyan : "\x1b[46m",
    BgWhite : "\x1b[47m",
    BgGray : "\x1b[100m",
    BgBrightRed : "\x1b[101m",
    BgBrightGreen : "\x1b[102m",
    BgBrightYellow : "\x1b[103m",
    BgBrightBlue : "\x1b[104m",
    BgBrightMagenta : "\x1b[105m",
    BgBrightCyan : "\x1b[106m",
    BgBrightWhite : "\x1b[107m",
    rgb : (r,g,b) => {
        return `\x1b[48;2;${r};${g};${b}m`;
    },
    Bit8 : n => {
        return `\x1b[48;5;${n}m`;
    }
}

const Style = {
    Italic : "\x1b[3m",
    Underline : "\x1b[4m",
    Blink : "\x1b[5m",
    Reverse : "\x1b[7m",
    Blink : "\x1b[5m",
    RapidBlink: "\x1b[6m",
    Hidden : "\x1b[8m",
    Strike : "\x1b[9m",
    NotItalic : "\x1b[23m",
    NotUnderline : "\x1b[24m",
    NotBlink : "\x1b[25m",
    NotReverse : "\x1b[27m",
    NotHidden : "\x1b[28m",
    NotStrike : "\x1b[29m",
    Overline : "\x1b[53m",
    NotOverline : "\x1b[55m",
};
