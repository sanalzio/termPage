/* constant values */

// array for command history
let history = [], tempHistory = [];

let currentHistoryElement = 0;

const user = document.getElementById("user");
const host = document.getElementById("host");
const prefixElement = document.getElementById("prefix");
const form = document.getElementById("form");
const mainDiv = document.getElementById("main");
const stdInElement = document.getElementById("std-in");
const autoComp = document.getElementById("outo-complete");
const stdOut = document.getElementById("std-out");
const colorSchemeLinkElement = document.getElementById("color_scheme");

// modules folder location
const modulesFolderLocation = location.href.split("/").slice(0,-1).join("/") + "/modules/";

const session = {
    defaultPrefix: prefixElement.innerHTML,

    // for shift+enter event
    allowMultiLines: false,

    scrolledProcessStart: false,

    tempAutoCompList: new Array(),
    autoCompList: new Array()
};

const isExtension = ((typeof browser !== "undefined" && typeof browser.runtime !== "undefined") || (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined"));
const browserObj = isExtension ? ((typeof browser !== "undefined" && browser.runtime && browser.runtime.getURL) ? browser : chrome) : undefined;

// setup ansi up module //
const ansi_up = new AnsiUp;
ansi_up.use_classes = true;
// setup ansi up module //

let settings, manifest;

let times, time24s, timeInterval;

// for eval command
const defaultLog = console.log;

let thisProcess, thisProcessPrefix, inProcess, processScrollTop;

// for autocomplete
const alwaysShowSuggestionsDefault = false,
      autoCompIgnoreCaseDefault = false;


// interval function for effective time event
const timeIntervalFunction = () => {
    if (times)

        for (let i = 0; i < times.length; i++) {

            const element = times[i];
            element.innerHTML = new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        }
    if (time24s)

        for (let i = 0; i < time24s.length; i++) {

            const element = time24s[i];
            element.innerHTML = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        }
}

// default aliases
let aliases = {
    "h": "help",
    "s": "search",
    "calculator": "calc",
    "math": "calc",
    "@ECHO": "@echo"
}

/* constant values */

/* fetch function with timeout */

async function request(url, options = {}, timeout = null, logErr = true) {
                                      // (miliseconds)
    if (timeout) return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);

    return fetch(url, options);
}

/* fetch function with timeout */


/* escape html unsafe characters */

function escapeUnsafeHTML(string) {
    return string
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* escape html unsafe characters */


/* get history from localStorage */

if(localStorage.history){
    history.push(...JSON.parse(localStorage.history));
    currentHistoryElement = history.length;
}

/* get history from localStorage */


/* scroll of console output */

const scroll = {

    toEnd: function () {

        if (settings.allow_smooth_scroll) {
            mainDiv.scrollTo({top: mainDiv.scrollHeight, behavior: 'smooth'});
            return;
        }

        mainDiv.scrollTop = mainDiv.scrollHeight;
    },

    toStart: function () {

        if (settings.allow_smooth_scroll) {
            mainDiv.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }

        mainDiv.scrollTop = 0;
    },

    by: function (y) {

        if (settings.allow_smooth_scroll) {
            mainDiv.scrollBy({top: y, behavior: 'smooth'});
            return;
        }

        mainDiv.scrollBy(0, y);
    },

    to: function (y) {

        if (settings.allow_smooth_scroll) {
            mainDiv.scrollTo({top: y, behavior: 'smooth'});
            return;
        }

        mainDiv.scrollTo(0, y);
    }
};

/* scroll of console output */


/* Classes for io operations */

const stdout = {

    getOutputElement: () => inProcess ? stdOut.querySelector("span.process:last-child > span.process-out") : stdOut,

    // write input and add line break to output
    log: function (text, format = true, autoReset = true) {

        const standartOutput = stdout.getOutputElement();

        if (!format) {
            standartOutput.innerHTML += text + "<br>";
            return;
        }
        standartOutput.innerHTML += ansi_up.ansi_to_html(text + (autoReset?Reset:"") + "\n").replaceAll("\n", "<br>")
    },
    // write error and add line break to output
    error: function (text, format = true, autoReset = true) {

        const standartOutput = stdout.getOutputElement();

        if (!format) {
            standartOutput.innerHTML += "<span class=\"ansi-red-fg\">Error</span>: " + text.replaceAll("\n", "<br>") + "<br>";
            return;
        }
        standartOutput.innerHTML += ansi_up.ansi_to_html(Fore.Red + "Error" + Reset + ": " + text + (autoReset?Reset:"") + "\n").replaceAll("\n", "<br>");
    },
    // write input to output
    write: function (text, format = true, autoReset = true) {

        const standartOutput = stdout.getOutputElement();

        if (!format) {
            standartOutput.innerHTML += text;
            return;
        }
        standartOutput.innerHTML += ansi_up.ansi_to_html(text + (autoReset?Reset:"")).replaceAll("\n", "<br>");
    },
    // clear console
    clear: function () {
        stdOut.innerHTML = "";
    },
    // clear process output
    clearProcessOut: function () {

        if (!inProcess) return;

        const standartOutput = stdOut.querySelector("span.process:last-child > span.process-out");

        standartOutput.innerHTML = "";
    },
    // start command process
    startProcess: function (thisPrefix = prefixElement.innerHTML) {

        stdInElement.rows = 1;

        const stdInValue = stdInElement.value;

        let inputStr = escapeUnsafeHTML(stdInValue);

        if (inputStr.includes("\n")) inputStr = inputStr.replaceAll("\n", "\n" + " ".repeat(prefixElement.innerText.length));

        stdOut.innerHTML += "<span class=\"process\">" +
            "<span class=\"process-command\">" +
            thisPrefix +
            inputStr +
            "</span><br><span class=\"process-out\"></span></span>";

        scroll.toEnd();

        if(stdInValue != "" && history[history.length -1] !== stdInValue) { // && thisProcess === undefined

            history.push(stdInValue);
            currentHistoryElement = history.length;

            if(settings.remebmer_history)
                localStorage.setItem("history", JSON.stringify(history));
        }

        stdInElement.value = "";

        form.style.display = "none";

        processScrollTop = stdOut.clientHeight;
        session.scrolledProcessStart = false;

        inProcess = true;

        return stdInValue;

    },
    // exit command process
    exitProcess: function () {
        stdInElement.value = "";
        form.style.display = "flex";

        if (!session.scrolledProcessStart)
            scroll.toEnd();

        stdInElement.focus();
        inProcess = false;
    },
    // scroll process start
    scrollProcessStart: function () {
        scroll.to(processScrollTop);
        session.scrolledProcessStart = true;
    }
}

const stdin = {
    readKey: function () {

        return new Promise((resolve) => {
            function onKeyPress(event) {
                window.removeEventListener("keydown", onKeyPress);
                resolve(event);
            }

            window.addEventListener("keydown", onKeyPress);
        });
    },
    readLine: function (options) {

        options = { ...{ prefix: "", formatPrefix: undefined, allowCancel: true, allowMultiLines: false, writeInput: true }, ...options };

        /*
        options = {
            prefix: String  =>  (""),
            formatPrefix: Boolean  =>  (undefined),
            allowCancel: Boolean  =>  (false),
            allowMultiLines: Boolean  =>  (false),
            writeInput: Boolean  =>  (true),
            cursor: UnsignedInt | "start" | "end"  =>  ("end"),
            selectionStart: UnsignedInt  =>  (undefined),
            selectionEnd: UnsignedInt  =>  (undefined),
            beforeRead: Function  =>  (undefined),
            selectAll: Boolean  =>  (false)
        }
        */

        session.reading = true;

        // Set auto formatPrefix to true if it ansi escape code includes.
        if (options.formatPrefix == undefined) {
            if (options.prefix.includes("\x1b") || options.prefix.includes("\u001b"))
                options.formatPrefix = true;
            else
                options.formatPrefix = false;
        }

        const beforePrefix = prefixElement.innerHTML;
        const prefixContent = options.formatPrefix ? ansi_up.ansi_to_html(options.prefix).replaceAll("\n", "") : options.prefix;
        if (options.prefix !== undefined) prefixElement.innerHTML = prefixContent;
        const beforeallowMultiLines = session.allowMultiLines;
        if (options.allowMultiLines) session.allowMultiLines = options.allowMultiLines;

        const beforeDisplay = form.style.display;
        form.style.display = "flex";
        if (!session.scrolledProcessStart) scroll.toEnd();
        stdInElement.focus();

        stdInElement.value = options.content ?? "";

        if (typeof options.cursor == "number") {
            stdInElement.selectionStart = options.cursor;
            stdInElement.selectionEnd = options.cursor;
        } else if (options.cursor == "start") {
            stdInElement.selectionStart = stdInElement.selectionEnd = 0;
        } else {
            stdInElement.selectionStart = stdInElement.selectionEnd = stdInElement.value.length;
        }
        if (options.selectAll) {
            stdInElement.selectionStart = 0;
            stdInElement.selectionEnd = stdInElement.value.length;
        }

        if (typeof options.selectionStart == "number")
            stdInElement.selectionStart = options.selectionStart;
        if (typeof options.selectionEnd == "number")
            stdInElement.selectionEnd = options.selectionEnd;

        stdInElement.focus();
        if (typeof options.beforeRead == "function") options.beforeRead();

        return new Promise((resolve) => {
            function onKeyPress(event) {
                if (options.allowCancel && event.ctrlKey && event.key == "c") {
                    event.preventDefault();
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;
                    session.allowMultiLines = beforeallowMultiLines;

                    if (options.writeInput)
                        stdout.log(prefixContent, false);

                    resolve(undefined);
                }
                if (!event.shiftKey && event.key == "Enter") {
                    event.preventDefault();
                    const input = stdInElement.value;
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;
                    session.allowMultiLines = beforeallowMultiLines;

                    if (options.writeInput)
                        stdout.log(prefixContent + escapeUnsafeHTML(input), false);

                    resolve(input);
                }
            }

            stdInElement.addEventListener("keydown", onKeyPress);
        });
    },
    readInt: function (options) {

        options = { ...{ prefix: "", formatPrefix: undefined, allowCancel: true, writeInput: true }, ...options };

        /*
        options = {
            prefix: String  =>  (""),
            formatPrefix: Boolean  =>  (undefined),
            allowCancel: Boolean  =>  (false),
            allowMultiLines: Boolean  =>  (false),
            writeInput: Boolean  =>  (true),
            cursor: UnsignedInt | "start" | "end"  =>  ("end"),
            selectionStart: UnsignedInt  =>  (undefined),
            selectionEnd: UnsignedInt  =>  (undefined),
            beforeRead: Function  =>  (undefined)
        }
        */

        session.reading = true;

        // Set auto options.formatPrefix to true if it ansi escape code includes.
        if (options.formatPrefix == undefined) {
            if (options.prefix.includes("\x1b") || options.prefix.includes("\u001b"))
                options.formatPrefix = true;
            else
                options.formatPrefix = false;
        }

        const beforeDisplay = form.style.display;
        const beforePrefix = prefixElement.innerHTML;

        const prefixContent = options.formatPrefix ? ansi_up.ansi_to_html(options.prefix).replaceAll("\n", "") : options.prefix;
        if (options.prefix !== undefined) prefixElement.innerHTML = prefixContent;

        form.style.display = "flex";
        if (!session.scrolledProcessStart) scroll.toEnd();
        stdInElement.focus();

        stdInElement.value = options.content ? options.content.toString() : "";

        if (typeof options.cursor == "number") {
            stdInElement.selectionStart = options.cursor;
            stdInElement.selectionEnd = options.cursor;
        } else if (options.cursor == "start") {
            stdInElement.selectionStart = stdInElement.selectionEnd = 0;
        } else {
            stdInElement.selectionStart = stdInElement.selectionEnd = stdInElement.value.length;
        }
        if (options.selectAll) {
            stdInElement.selectionStart = 0;
            stdInElement.selectionEnd = stdInElement.value.length;
        }

        if (typeof options.selectionStart == "number")
            stdInElement.selectionStart = options.selectionStart;
        if (typeof options.selectionEnd == "number")
            stdInElement.selectionEnd = options.selectionEnd;

        stdInElement.focus();
        if (typeof options.beforeRead == "function") options.beforeRead();

        return new Promise((resolve) => {
            function onKeyPress(event) {
                if (allowCancel && event.ctrlKey && event.key == "c") {
                    event.preventDefault();
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (writeInput)
                        stdout.log(prefixContent + "^c", false);

                    resolve(undefined);
                }

                const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
                if (
                    !/^[0-9-]$/.test(event.key) &&
                    !allowedKeys.includes(event.key)
                ) {
                    event.preventDefault();
                    return;
                }

                if (!event.shiftKey && event.key == "Enter") {
                    event.preventDefault();
                    const input = stdInElement.value === "" ? undefined : stdInElement.value;
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (writeInput)
                        stdout.log(prefixContent + (input ?? ""), false);

                    resolve(parseInt(input));
                }
            }

            stdInElement.addEventListener("keydown", onKeyPress);
        });
    },
    readUInt: function (options) {

        options = { ...{ prefix: "", formatPrefix: undefined, allowCancel: true, writeInput: true }, ...options };

        /*
        options = {
            prefix: String  =>  (""),
            formatPrefix: Boolean  =>  (undefined),
            allowCancel: Boolean  =>  (false),
            allowMultiLines: Boolean  =>  (false),
            writeInput: Boolean  =>  (true),
            cursor: UnsignedInt | "start" | "end"  =>  ("end"),
            selectionStart: UnsignedInt  =>  (undefined),
            selectionEnd: UnsignedInt  =>  (undefined),
            beforeRead: Function  =>  (undefined)
        }
        */

        session.reading = true;

        // Set auto options.formatPrefix to true if it ansi escape code includes.
        if (options.formatPrefix == undefined) {
            if (options.prefix.includes("\x1b") || options.prefix.includes("\u001b"))
                options.formatPrefix = true;
            else
                options.formatPrefix = false;
        }

        const beforeDisplay = form.style.display;
        const beforePrefix = prefixElement.innerHTML;

        const prefixContent = options.formatPrefix ? ansi_up.ansi_to_html(options.prefix).replaceAll("\n", "") : options.prefix;
        if (options.prefix !== undefined) prefixElement.innerHTML = prefixContent;

        form.style.display = "flex";
        if (!session.scrolledProcessStart) scroll.toEnd();
        stdInElement.focus();

        stdInElement.value = options.content ? options.content.toString() : "";

        if (typeof options.cursor == "number") {
            stdInElement.selectionStart = options.cursor;
            stdInElement.selectionEnd = options.cursor;
        } else if (options.cursor == "start") {
            stdInElement.selectionStart = stdInElement.selectionEnd = 0;
        } else {
            stdInElement.selectionStart = stdInElement.selectionEnd = stdInElement.value.length;
        }
        if (options.selectAll) {
            stdInElement.selectionStart = 0;
            stdInElement.selectionEnd = stdInElement.value.length;
        }

        if (typeof options.selectionStart == "number")
            stdInElement.selectionStart = options.selectionStart;
        if (typeof options.selectionEnd == "number")
            stdInElement.selectionEnd = options.selectionEnd;

        stdInElement.focus();
        if (typeof options.beforeRead == "function") options.beforeRead();

        return new Promise((resolve) => {
            function onKeyPress(event) {
                if (options.allowCancel && event.ctrlKey && event.key == "c") {
                    event.preventDefault();
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (options.writeInput)
                        stdout.log(prefixContent + "^c", false);

                    resolve(undefined);
                }

                const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
                if (
                    !/^[0-9]$/.test(event.key) &&
                    !allowedKeys.includes(event.key)
                ) {
                    event.preventDefault();
                    return;
                }

                if (!event.shiftKey && event.key == "Enter") {
                    event.preventDefault();
                    const input = stdInElement.value === "" ? undefined : stdInElement.value;
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (options.writeInput)
                        stdout.log(prefixContent + (input ?? ""), false);

                    resolve(parseInt(input));
                }
            }

            stdInElement.addEventListener("keydown", onKeyPress);
        });
    },
    readFloat: function (options) {

        options = { ...{ prefix: "", formatPrefix: undefined, allowCancel: true, writeInput: true }, ...options };

        /*
        options = {
            prefix: String  =>  (""),
            formatPrefix: Boolean  =>  (undefined),
            allowCancel: Boolean  =>  (false),
            allowMultiLines: Boolean  =>  (false),
            writeInput: Boolean  =>  (true),
            cursor: UnsignedInt | "start" | "end"  =>  ("end"),
            selectionStart: UnsignedInt  =>  (undefined),
            selectionEnd: UnsignedInt  =>  (undefined),
            beforeRead: Function  =>  (undefined)
        }
        */

        session.reading = true;

        // Set auto options.formatPrefix to true if it ansi escape code includes.
        if (options.formatPrefix == undefined) {
            if (options.prefix.includes("\x1b") || options.prefix.includes("\u001b"))
                options.formatPrefix = true;
            else
                options.formatPrefix = false;
        }

        const beforeDisplay = form.style.display;
        const beforePrefix = prefixElement.innerHTML;

        const prefixContent = options.formatPrefix ? ansi_up.ansi_to_html(options.prefix).replaceAll("\n", "") : options.prefix;
        if (options.prefix !== undefined) prefixElement.innerHTML = prefixContent;

        form.style.display = "flex";
        if (!session.scrolledProcessStart) scroll.toEnd();
        stdInElement.focus();

        stdInElement.value = options.content ? options.content.toString() : "";

        if (typeof options.cursor == "number") {
            stdInElement.selectionStart = options.cursor;
            stdInElement.selectionEnd = options.cursor;
        } else if (options.cursor == "start") {
            stdInElement.selectionStart = stdInElement.selectionEnd = 0;
        } else {
            stdInElement.selectionStart = stdInElement.selectionEnd = stdInElement.value.length;
        }
        if (options.selectAll) {
            stdInElement.selectionStart = 0;
            stdInElement.selectionEnd = stdInElement.value.length;
        }

        if (typeof options.selectionStart == "number")
            stdInElement.selectionStart = options.selectionStart;
        if (typeof options.selectionEnd == "number")
            stdInElement.selectionEnd = options.selectionEnd;

        stdInElement.focus();
        if (typeof options.beforeRead == "function") options.beforeRead();

        return new Promise((resolve) => {
            function onKeyPress(event) {
                if (options.allowCancel && event.ctrlKey && event.key == "c") {
                    event.preventDefault();
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (options.writeInput)
                        stdout.log(prefixContent + "^c", false);

                    resolve(undefined);
                }

                const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
                if (
                    !/^[0-9-.]$/.test(event.key) &&
                    !allowedKeys.includes(event.key)
                ) {
                    event.preventDefault();
                    return;
                }

                if (!event.shiftKey && event.key == "Enter") {
                    event.preventDefault();
                    const input = stdInElement.value === "" ? undefined : stdInElement.value;
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (options.writeInput)
                        stdout.log(prefixContent + (input ?? ""), false);

                    resolve(parseFloat(input));
                }
            }

            stdInElement.addEventListener("keydown", onKeyPress);
        });
    },
    readUFloat: function (options) {

        options = { ...{ prefix: "", formatPrefix: undefined, allowCancel: true, writeInput: true }, ...options };

        /*
        options = {
            prefix: String  =>  (""),
            formatPrefix: Boolean  =>  (undefined),
            allowCancel: Boolean  =>  (false),
            allowMultiLines: Boolean  =>  (false),
            writeInput: Boolean  =>  (true),
            cursor: UnsignedInt | "start" | "end"  =>  ("end"),
            selectionStart: UnsignedInt  =>  (undefined),
            selectionEnd: UnsignedInt  =>  (undefined),
            beforeRead: Function  =>  (undefined)
        }
        */

        session.reading = true;

        // Set auto options.formatPrefix to true if it ansi escape code includes.
        if (options.formatPrefix == undefined) {
            if (options.prefix.includes("\x1b") || options.prefix.includes("\u001b"))
                options.formatPrefix = true;
            else
                options.formatPrefix = false;
        }

        const beforeDisplay = form.style.display;
        const beforePrefix = prefixElement.innerHTML;

        const prefixContent = options.formatPrefix ? ansi_up.ansi_to_html(options.prefix).replaceAll("\n", "") : options.prefix;
        if (options.prefix !== undefined) prefixElement.innerHTML = prefixContent;

        form.style.display = "flex";
        if (!session.scrolledProcessStart) scroll.toEnd();
        stdInElement.focus();

        stdInElement.value = options.content ? options.content.toString() : "";

        if (typeof options.cursor == "number") {
            stdInElement.selectionStart = options.cursor;
            stdInElement.selectionEnd = options.cursor;
        } else if (options.cursor == "start") {
            stdInElement.selectionStart = stdInElement.selectionEnd = 0;
        } else {
            stdInElement.selectionStart = stdInElement.selectionEnd = stdInElement.value.length;
        }
        if (options.selectAll) {
            stdInElement.selectionStart = 0;
            stdInElement.selectionEnd = stdInElement.value.length;
        }

        if (typeof options.selectionStart == "number")
            stdInElement.selectionStart = options.selectionStart;
        if (typeof options.selectionEnd == "number")
            stdInElement.selectionEnd = options.selectionEnd;

        stdInElement.focus();
        if (typeof options.beforeRead == "function") options.beforeRead();

        return new Promise((resolve) => {
            function onKeyPress(event) {
                if (options.allowCancel && event.ctrlKey && event.key == "c") {
                    event.preventDefault();
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (options.writeInput)
                        stdout.log(prefixContent + "^c", false);

                    resolve(undefined);
                }

                const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
                if (
                    !/^[0-9.]$/.test(event.key) &&
                    !allowedKeys.includes(event.key)
                ) {
                    event.preventDefault();
                    return;
                }

                if (!event.shiftKey && event.key == "Enter") {
                    event.preventDefault();
                    const input = stdInElement.value === "" ? undefined : stdInElement.value;
                    stdInElement.value = "";
                    stdInElement.removeEventListener("keydown", onKeyPress);

                    form.style.display = beforeDisplay;
                    prefixElement.innerHTML = beforePrefix;
                    session.reading = false;

                    if (options.writeInput)
                        stdout.log(prefixContent + (input ?? ""), false);

                    resolve(parseFloat(input));
                }
            }

            stdInElement.addEventListener("keydown", onKeyPress);
        });
    }
};

/* Classes for io operations */


/* Function for get command aliases */

function getAliases(command) {
    const commandAliases = Object.entries(aliases)
        .filter(([key, value]) => value === command)
        .map(([key]) => key)
        .join(", ");

    return commandAliases ? `Aliases: ${commandAliases}` : "";
}

/* Function for get command aliases */


/* Function for effective time */

function effectiveTime() {
    times = document.getElementsByClassName("time");
    time24s = document.getElementsByClassName("time24");
}

/* Function for effective time */


/* Function for parse arguments */

function parseInput(input) {

    // arguments
    const argv = [];

    // string from non flag arguments
    let _ = "";

    // flag options
    const options = {};

    // regexp for match arguments
    const regex = /(?:[^\s]+|"[^"]*"|'[^']*')+/g;
    const simpleRegex = /(?:^|(?<=\s))(?:(?!-)\S+|"[^"]*"|'[^']*')/g;

    // match arguments
    const args = input.match(regex).map(arg => arg.replace(/^(['"])([\s\S]+)\1$/g, '$2'));
    const simpleArgs = input.match(simpleRegex).map(arg => arg.replace(/^(?<!\\)["'](-+)(.+)(?<!\\)["']$/g, "$1$2").replace(/(?<!\\)\\(["'])/g, "$1"));

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        // push argument to argv array
        argv.push(arg);

        // if this is a flag
        if (arg.startsWith('-')) {

            // get flag name
            const key = arg.replace(/^--?/, '');

            // if next argument is not a flag
            if ((i + 1) < args.length && !args[i + 1].startsWith('-')) {

                // if flag has an argument
                if (arg.startsWith('--')) {

                    options[key] = args[i + 1];
                    argv.push(args[i + 1]);
                    i += 2;
                } else {
                    options[key] = true;
                    i++;
                }
            } else {

                options[key] = true;
                i++;
            }
        } else {
            if (i > 0) _ += _.length > 0 ? " " + arg : arg;
            i++;
        }
    }

    /*i = 0;
    while (i < simpleArgs.length) {
        const arg = simpleArgs[i];

         //if this is a command name
        if (i===0) {
            i++;
            continue;
        }

        else {

            if (_ === "") {

                _ = arg;
            } else {

                _ += " " + arg;
            }

        }

        i++;
    }*/

    const command = argv.shift();
    const $1 = input.slice(command.length + 1);

    return { command, argv, simpleArgs, options, _, $0: input, $1 };
}

/* Function for parse arguments */


/* Function for get browser name */

function getBrowserType() {

    if (typeof navigator.brave !== "undefined" && typeof navigator.brave.isBrave !== "undefined") {
        return "brave";
    }

    const test = (regexp) => {
        return regexp.test(navigator.userAgent);
    };

    if (test(/opr\//i) || !!window.opr) {
        return "opera";
    } else if (test(/edg/i)) {
        return "edge";
    } else if (test(/chrome|chromium|crios/i)) {
        return "chromium";
    } else if (test(/firefox|fxios/i)) {
        return "firefox";
    } else if (test(/safari/i)) {
        return "safari";
    } else if (test(/trident/i)) {
        return "explorer";
    } else if (test(/ucbrowser/i)) {
        return "uc-browser";
    } else if (test(/samsungbrowser/i)) {
        return "samsung-browser";
    } else {
        return "termpage";
    }
}

/* Function for get browser name */


/* chanage some tags name on load */

function nameChange() {
    
    // change host text with browser name
    host.innerHTML = settings.host ?? getBrowserType();


    // change user text with user name
    user.innerHTML = settings.user;

    // change title text with tab name
    document.title = settings.title;

    session.defaultPrefix = prefixElement.innerHTML;

}

/* chanage some tags name on load */


/* commands */

const commands = {
    "@echo": {
        func: async function (process) {
            if (process._.toLowerCase() == "on") {
                prefixElement.innerHTML = session.defaultPrefix;
            } else if (process._.toLowerCase() == "off") {
                prefixElement.innerHTML = "";
            }
            return 0;
        },
        about: `Switch echo on/off. %ALIASES%\nExample:\n $ @echo on\n $ @echo off`
    },
    "cat": {
        func: async function (process, isInput = false) {

            // if is std input
            if(isInput) {
                stdout.log(process.$1, true);

                // set std input prefix
                return "";
            }

            // if no argument
            if (process.$1 == "") {

                // set std input prefix
                return "";
            }

            // if argument is a url
            const res = await request(process.$1);

            if (!res) return 500;

            // if connection returned error
            const err = res.status !== 200 ? res.status : null;
            if (err) {
                // log error code
                stdout.error("Response returned " + Fore.Bold + Fore.Red + err + Fore.Reset + " code.");
                // exit with error code
                return err;
            }

            const data = await res.text();

            // log file content
            stdout.write(data + (data.endsWith("\n") ? "" : "\n"), false);

            // exit
            return 0;
        },
        about: `Read file content. %ALIASES%\nExamples:\n $ cat ./file.txt\n $ cat https://example.com/file.txt`
    },
    "echo": {
        func: async function (process, isInput = false) {

            // if no argument
            if (process.$1 == "") {

                // set std input prefix
                return "";
            }

            stdout.log(process.$1, false);

            // if is std input
            if(isInput)
                // set std input prefix
                return "";

            return 0;
        },
        about: `Echo command. %ALIASES%`
    },
    "reload": {
        func: async function (process) {
            window.location.reload(false);
            return 0;
        },
        about: `Reload page. %ALIASES%`
    },
    "close": {
        func: async function (process) {
            window.close();
            return 0;
        },
        about: `Close page. %ALIASES%`
    },
    "clear": {
        func: async function (process) {
            stdout.clear();

            // clear history
            if (process.options.all || process.options.a) {
                clearHistory();
            }

            return 0;
        },
        about: `Clear console. %ALIASES%\n Flags:\n  --all - Clear console with history\n Examples:\n  $ clear\n  $ clear --all`
    },
    "bash": {
        func: async function (process) {

            // if argument is a url
            const res = await request(process.$1);

            if (!res) return 1;

            // if connection error
            const err = res.status !== 200 ? res.status : null;
            if (err) {
                // log error code
                stdout.error("Response returned " + Fore.Bold + Fore.Red + err + Fore.Reset + " code.");
                // exit with error code
                return err;
            }

            const scriptContent = await res.text();

            await executeScript(scriptContent);

            return 0;
        },
        about: `Run script. %ALIASES%\nExample:\n $ bash ./file.sh\n $ bash https://example.com/script.sh`
    },
    "sh": {
        func: async function (process, isInput = false) {

            // if is std input
            if(isInput) {

                // parse input arguments
                const inputProcess = parseInput(process.$1);

                // execute command
                if (commands[inputProcess.command]) {

                    // execute command and get reuturned code
                    let result;

                    try {
                        result = await commands[inputProcess.command].func(inputProcess);

                        // if returned error
                        if (result !== 0)
                            // log error code
                            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + result + Fore.Reset);

                        if (commands[inputProcess.command].beforeExit) {
                            try {
                                await commands[inputProcess.command].beforeExit(false);
                            } catch (error) {
                                stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                            }
                        }
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }
                
                // execute command if alias exists
                else if (inputProcess.command in aliases) {

                    // execute command and get reuturned code
                    let result;

                    try {
                        result = await commands[aliases[inputProcess.command]].func(inputProcess);

                        // if returned error
                        if (result !== 0)
                            // log error code
                            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + result + Fore.Reset);

                        if (commands[aliases[inputProcess.command]].beforeExit) {
                            try {
                                await commands[aliases[inputProcess.command]].beforeExit(false);
                            } catch (error) {
                                stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                            }
                        }
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }
                
                // if command not found
                else {
                    stdout.error("Command not found.");
                }

                // set std input prefix
                return session.rawPrefix;
            }
            if (process.$1 == "") {

                // set std input prefix
                return session.rawPrefix;
            }

            // exit
            return 0;
        },
        about: `Execute input. %ALIASES%`
    },
    "time": {
        func: async function (process) {

            // if used with --kill
            if (process.options["kill"]) {
                clearInterval(timeInterval);
                return 0;
            }

            // if used with --set
            if (process.options["set"]) {

                // set interval to change time on every second
                timeInterval = setInterval(timeIntervalFunction, 1000);

                // exit
                return 0;
            }

            // if used with --24h or default time format is 24 hours
            if (process.options["24h"] || (!process.options["12h"] && settings.time_hours == 24)) {

                const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                stdout.log("<span class=\"time24\">" + time + "</span>", false);

            }

            // if used with --24h or default time format is 24 hours
            else if (process.options["12h"] || (!process.options["24h"] && settings.time_hours == 12)) {

                const time = new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                stdout.log("<span class=\"time\">" + time + "</span>", false);

            }

            effectiveTime();

            // exit
            return 0;
        },
        about: `Print system time. %ALIASES%\nFlags:\n --set: enable effective time\n --kill: disable effective time\n --24h: print time in 24 hours\nExamples:\n $ time\n $ time --24h\n $ time --12h`
    },
    "about": {
        func: async function () {
            stdout.log(`
 ${Fore.BrightBlue}version${Fore.Reset}: ${Fore.Blue}${manifest.version}${Fore.Reset}
 ${Fore.BrightBlue}font family${Fore.Reset}: ${Fore.Blue}${window.getComputedStyle(mainDiv).fontFamily}${Fore.Reset}
 ${Fore.BrightBlue}search engine${Fore.Reset}: ${Fore.Blue}${settings["search_engine_url"].split("/")[2]}${Fore.Reset}

 ${Fore.Red}█${Fore.Reset} ${Fore.Green}█${Fore.Reset} ${Fore.Yellow}█${Fore.Reset} ${Fore.Blue}█${Fore.Reset} ${Fore.Magenta}█${Fore.Reset} ${Fore.Cyan}█${Fore.Reset} ${Fore.White}█${Fore.Reset} ${Fore.Black}█${Fore.Reset}
 ${Fore.BrightRed}█${Fore.Reset} ${Fore.BrightGreen}█${Fore.Reset} ${Fore.BrightYellow}█${Fore.Reset} ${Fore.BrightBlue}█${Fore.Reset} ${Fore.BrightMagenta}█${Fore.Reset} ${Fore.BrightCyan}█${Fore.Reset} ${Fore.BrightWhite}█${Fore.Reset} ${Fore.Gray}█${Fore.Reset}
`);
            return 0;
        },
        about: `Print information. %ALIASES%`
    },
    "date": {
        func: async function (process) {

            // if used with --long
            if (process.options.long) {
                stdout.log(new Date());
            } else {
                stdout.log(new Date().toLocaleDateString(
                    [],
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                ));
            }

            // exit
            return 0;
        },
        about: `Print system date. %ALIASES%\nExamples:\n $ date\n $ date --long`
    },
    "javascript": {
        func: async function (process, isInput = false) {

            // if is std input allow shift + enter for multiline input
            if(isInput) session.allowMultiLines = true;

            // if no arguments
            if (process.$1 == "") {

                session.allowMultiLines = true;
                // set std input prefix
                return ">&nbsp;";
            }

            // change console log to write to std out
            console.log = content => {
                stdOut.innerHTML += content+"\n";
            }

            let output;

            // create try-catch block for blocking errors
            try {
                // evaluate input and log output
                output = eval(process.$1);
                stdout.log(Fore.Bit8(247) + "< " + (typeof output == "object" ? JSON.stringify(output) : output));
            } catch (error) {
                // if error log it
                stdout.log(error);
            }

            // change console log back
            console.log = defaultLog;

            // if is std input
            if(isInput)
                // set std input prefix to empty
                return ">&nbsp;";

            // exit
            return 0;
        },
        about: `Execute JavaScript code. %ALIASES%\nExamples:\n $ js console.log("Hello, World!")`
    },
    "bookmarks": {
        func: async function (process) {
            stdout.log(
                await (
                    async ()=>{

                        let out = "";

                        for await (const [key, value] of Object.entries(settings.bookmarks)) {
                            out += Fore.BrightBlue + key + Fore.Reset + ": " + Fore.Blue + value + Fore.Reset + "\n";
                        }

                        return out.slice(0, -1);
                    }
                )()
            );
            return 0;
        },
        about: `Print all bookmarks. %ALIASES%\nExamples:\n $ bookmarks`
    },
    "sengs": {
        func: async function (process) {
            stdout.log(
                await (
                    async ()=>{

                        let out = "";

                        for await (const [key, value] of Object.entries(settings.search_engines)) {
                            out += Fore.BrightBlue + key + Fore.Reset + ": " + Fore.Blue + value + Fore.Reset + "\n";
                        }

                        return out.slice(0, -1);
                    }
                )()
            );
            return 0;
        },
        about: `Print all custom search engines. %ALIASES%`
    },
    "start": {
        func: async function (process) {

            // if no arguments
            if (process._ == "") {
                return 1;
            }

            // else start program
            window.open(process.argv[0] + "://" + process.argv.slice(1).join(" "), "_blank");
            return 0;
        },
        about: `Start program with custom URL Protocol. %ALIASES%\nExamples:\n $ start steam`
    },
    "calc": {
        func: async function (process, isInput = false) {

            // if no arguments
            if (process.$1 == "") {

                // set std input prefix to empty
                return "> ";
            }

            // create try-catch block for blocking errors
            try {
                // evaluate input and log output
                output = eval("const{sin,cos,tan,sqrt,pow,random}=Math;let pi=Math.PI;" + process.$1.toLowerCase());
                stdout.log(output);
            } catch (error) {
                // if error log it
                stdout.log(error);
            }

            //stdout.log(eval(process.$1));

            // if is std input
            if(isInput)
                // set std input prefix to empty
                return "> ";

            // exit
            return 0;
        },
        about: `Calculator. %ALIASES%\nExamples:\n $ calc 2+2\n $ math 2+2`
    },
    "go": {
        func: async function (process) {
            if (!settings.bookmarks[process._]) {
                stdout.error("Bookmark not found.");
                return 1;
            }

            if (process.options.i) {
                browserObj.windows.create({ url:settings.bookmarks[process._], incognito: true, focused: true, state: "maximized" });
                return 0;
            }
            if (process.options.nw) {
                browserObj.windows.create({ url:settings.bookmarks[process._], focused: true, state: "maximized" });
                return 0;
            }
            window.open(settings.bookmarks[process._], process.options.s ? "_self" : "_blank");
            return 0;
        },
        about: `Go bookmark. %ALIASES%\nFlags:\n -s: open in this tab\n -nw: open in new window\n -i: open in incognito window\nExamples:\n $ go github\n $ go -b github"`
    },
    "open": {
        func: async function (process) {
            let url = process._

            if(!url.match(/^[\w]*\:\/\//g))
                url = "https://" + url;

            if (process.options.s) {
                window.open(url, "_self");
                return 0;
            }

            if (process.options.i) {
                browserObj.windows.create({ url:url, incognito: true, focused: true, state: "maximized" });
                return 0;
            }

            if (process.options.nw) {
                browserObj.windows.create({ url:url, focused: true, state: "maximized" });
                return 0;
            }

            window.open(url, "_blank");
            return 0;
        },
        about: `Open url. %ALIASES%\nFlags:\n -s: open in this tab\n -nw: open in new window\n -i: open in incognito window\nExamples:\n $ openurl https://example.com`
    },
    "search": {
        func: async function (process) {
            if (!process._ || process._ == "") {
                stdout.error("Please enter a search term.");
                return 1;
            }

            let url = encodeURI(process._).replace(encodeURI(process._), settings["search_engine_url"]);

            for (const [k, v] of Object.entries(process.options)) {
                if (k == "s" || k == "nw" || k == "i") continue;

                if (settings.search_engines[k]) {
                    url = encodeURI(process._).replace(encodeURI(process._), settings.search_engines[k]);
                }
            }

            if (process.options.i) {
                browserObj.windows.create({ url:url, incognito: true, focused: true, state: "maximized" });
                return 0;
            }

            if (process.options.nw) {
                browserObj.windows.create({ url:url, focused: true, state: "maximized" });
                return 0;
            }

            if (process.options.s) {
                window.open(url, "_self");
            } else {
                window.open(url, "_blank");
            }

            return 0;
        },
        about: `Search in the web. %ALIASES%\nFlags:\n -s: open in this tab\n -nw: open in new window\n -i: open in incognito window\nExamples:\n $ search sanalzio\n $ s -s sanalzio\n $ s -yt Röportaj Adam`
    },
    "help": {
        func: async function (process) {
            if (process._) {
                if (commands[process._]) 
                    stdout.log(
                        Fore.BrightBlue +
                        process._ +
                        Fore.Reset +
                        ": " +
                        Fore.Blue +
                        commands[process._].about.replace(
                            "%ALIASES%",
                            getAliases(process._)
                        ) +
                        Fore.Reset
                    );
                else if (commands[aliases[process._]]) 
                    stdout.log(
                        Fore.BrightBlue +
                        aliases[process._] +
                        Fore.Reset +
                        ": " +
                        Fore.Blue +
                        commands[aliases[process._]].about.replace(
                            "%ALIASES%",
                            getAliases(aliases[process._])
                        ) +
                        Fore.Reset
                    );
                else {
                    stdout.error("Command not found.");
                    return 1;
                }
                return 0;
            }


            for (const command in commands) {
                stdout.log(
                    Fore.BrightBlue +
                    command +
                    Fore.Reset +
                    ": " +
                    Fore.Blue +
                    commands[command].about.replace(
                        "%ALIASES%",
                        getAliases(command)
                    ) +
                    Fore.Reset +
                    "\n"
                );
            }


            return 0;
        },
        about: `Show help. %ALIASES%\nExamples:\n $ help\n $ help cat`
    },
}

/* commands */


/* execute command function */

async function execute(command, writeLikeCommandInput = false, commandPrefix = "") {

    let exitCode = 0;

    // if this input is a comment, ignore it
    if(command === "" || command.startsWith("#")) exitCode = 0;

    const process = parseInput(command);


    if (writeLikeCommandInput) {

        stdOut.innerHTML += "<span class=\"process\">" +
        "<span class=\"process-command\">" +
        (commandPrefix ? commandPrefix : prefixElement.innerHTML) +
        (thisProcess != undefined ? command.slice(process.command.length + 1) : command) +
        "</span><br><span class=\"process-out\"></span></span>";

        inProcess = true;
    }

        
    if (commands[process.command]) {
        exitCode = await commands[process.command].func(process);
        if (exitCode !== 0) {
            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + exitCode + Fore.Reset);
        }
    }

    else if (process.command in aliases) {
        exitCode = await commands[aliases[process.command]].func(process);
        if (exitCode !== 0) {
            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + exitCode + Fore.Reset);
        }
    }

    if (writeLikeCommandInput)
        inProcess = false;

    scroll.toEnd();

}

/* execute command function */


/* execute script function */

async function executeScript(scriptContent) {

    form.style.display = "none";

    for (let i = 0; i < scriptContent.split("\n").length; i++) {
        const command = scriptContent.split("\n")[i];
            
        let exitCode = 0;

        if(command === "" || command.startsWith("#")) continue;

        const process = parseInput(command);
            
        if (commands[process.command]) {
            exitCode = await commands[process.command].func(process);
            if (exitCode !== 0) {
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + exitCode + Fore.Reset);
            }
        }

        else if (process.command in aliases) {
            exitCode = await commands[aliases[process.command]].func(process);
            if (exitCode !== 0) {
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + exitCode + Fore.Reset);
            }
        }
        
    }
    
    form.style.display = "flex";
    scroll.toEnd();
    
}

/* execute script function */


/* auto focus to #std-in */

mainDiv.addEventListener("click", () => {
    if(!window.getSelection().toString() && !(document.activeElement == stdInElement)) stdInElement.focus({ preventScroll: true });
});

stdInElement.addEventListener("input", () => {
    scroll.toEnd();
});

/* auto focus to #std-in */


/* disable focusing to #std-out */

stdOut.addEventListener("focusin", function (event) {
    event.stopPropagation();
    event.preventDefault();
    event.target.blur();
    stdInElement.focus({
        preventScroll: true
    });
}, true);

/* disable focusing to #std-out */


/* add command function */

function addCommand(cmd, func, options) {

    options = {about: cmd + " command. %ALIASES%", ...options};

    commands[cmd] = new Object();
    commands[cmd].func = func;
    commands[cmd].about = options.about;

    session.autoCompList.push(cmd);

    if (Array.isArray(options.aliases) && options.aliases.length > 0) {
        for (let i = 0; i < options.aliases.length; i++) {
            const alias = options.aliases[i];
            aliases[alias] = cmd;
            session.autoCompList.push(alias);
        }
    }

    if (options.beforeExit && typeof options.beforeExit == "function") commands[cmd].beforeExit = options.beforeExit;
    if (options.autoComplete && Array.isArray(options.autoComplete)) commands[cmd].autoComplete = options.autoComplete;
}

/* add command function */


/* execute command buttons */


/*  usage: <span class="exec-cmd" command="echo Hello, World!" >Click me!</span>
*                                                 ^                ^
*                                         command to execute   display text
*/

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("exec-cmd") && event.target.getAttribute("command"))
        execute(event.target.getAttribute("command"), true);
});


/* execute command buttons */


/* funtion for load custom themes from settings.json */

function applyThemes() {
    for (let i = 0; i < settings.themes.length; i++) {
        let theme;

        if (typeof settings.themes[i] == "object") 
            theme = settings.themes[i]
        else
            theme = {
                path: settings.themes[i]
            };

        const themeElement = document.createElement("link");
        themeElement.setAttribute("rel", "stylesheet");

        if (theme.media)
            themeElement.media = theme.media;
        if (theme.colorScheme)
            themeElement.media += (themeElement.media.length > 0 ? "and" : "") + "(prefers-color-scheme: " + theme.colorScheme + ")";

        themeElement.setAttribute("href", theme.path);
        document.head.appendChild(themeElement);
    }
}

/* funtion for load custom themes from settings.json */


/* funtion for load favicon */

function loadFavicon() {
    if(!settings.tab_favicon) return;


    const favicon = document.createElement("link");

    favicon.setAttribute("rel", "shortcut icon");
    favicon.setAttribute("type", "image/x-icon");
    favicon.setAttribute("href", settings.tab_favicon);

    document.head.appendChild(favicon);
}

/* funtion for load favicon */


/* auto complete functions */

function autoComplete() {
    if(settings["enable_auto_complete"]) {
        if (stdInElement.value.trim().length < 1) {
            clearAutoComp();
            return;
        }

        if (session.originalInput) session.originalInput = undefined;

        if ((settings.suggest_from_history ? [...session.autoCompList, ...history] : session.autoCompList).some(el => session.autoCompIgnoreCase ? el.toLowerCase() === stdInElement.value.toLowerCase() : el === stdInElement.value)) {
            if (!session.alwaysShowSuggestions) {
                autoComp.innerHTML = "";
            }
            if (typeof onAutoCompMatchFound == "object") onAutoCompMatchFound.forEach(f=>f());
            return;
        }

        session.autoCompListNow = (settings.suggest_from_history ? [...session.autoCompList, ...history] : session.autoCompList).filter(el => session.autoCompIgnoreCase ? el.toLowerCase().startsWith(stdInElement.value.toLowerCase()) && el.toLowerCase() !== stdInElement.value.toLowerCase() : el.startsWith(stdInElement.value) && el !== stdInElement.value);

        if (session.autoCompListNow.length == 0) {
            clearAutoComp();
            return;
        }

        session.autoCompIndex = 0;
        autoComp.innerHTML = session.autoCompListNow[session.autoCompIndex];
    }
}

function clearAutoComp() {
    if (!settings["enable_auto_complete"]) return;

    session.autoCompIndex = 0;
    autoComp.innerHTML = "";
    session.autoCompListNow = new Array();
    if (typeof onClearAutoComp == "object") onClearAutoComp.forEach(f=>f());
}

function resetAutoCompList() {
    if (!settings["enable_auto_complete"]) return;

    session.autoCompList = [...Object.keys(commands).filter(el => el.length > 1), ...Object.keys(aliases).filter(el => el.length > 1)].filter(el => el.length > 1);
}

function clearAutoCompList() {
    if (!settings["enable_auto_complete"]) return;

    session.tempAutoCompList = [...session.autoCompList];
    session.autoCompList = new Array();
}

function restoreAutoCompList() {
    if (!settings["enable_auto_complete"]) return;

    session.autoCompList = [...session.tempAutoCompList];
    session.tempAutoCompList = new Array();
}

/* auto complete functions */


/* process history system functions */

function backupHistory(commandObject) {
    tempHistory = [...history];

    if (!commandObject.history) {
        commandObject.history = new Array();
        currentHistoryElement = 0;
        history = new Array();
    } else {
        history = [...commandObject.history];
        currentHistoryElement = history.length;
    }

}

function restoreHistory(commandObject) {

    commandObject.history = [...history];

    history = [...tempHistory];
    tempHistory = new Array();
    currentHistoryElement = history.length;
}

/* process history system functions */


/* function for load module script to dom */

function loadModuleDom(moduleName) {
    const moduleScriptElement = document.createElement("script");
    moduleScriptElement.src = modulesFolderLocation + moduleName + ".js";

    document.body.appendChild(moduleScriptElement);
}

/* function for load module script to dom */


/* copy paste like terminal */

function initCopyPasteLikeTerminal() {
    if (settings["enable_terminal_like_copy_paste"]) {
        // copy to clipboard with just enter key
        window.addEventListener("keydown", async (event) => {

            if (event.key == "Enter" && window.getSelection().toString()) {
                event.preventDefault();

                await navigator.clipboard.writeText(window.getSelection().toString());
                window.getSelection().removeAllRanges();
            }

        });

        // paste with right click
        mainDiv.addEventListener("contextmenu", async (event) => {
            event.preventDefault();
            clearAutoComp();

            const clipboardText = await navigator.clipboard.readText();

            if (session.allowMultiLines || (!clipboardText.includes("\n") && !clipboardText.includes("\r")))

                stdInElement.setRangeText(clipboardText, stdInElement.selectionStart, stdInElement.selectionEnd, 'end');

            else {
                stdInElement.setRangeText(
                    clipboardText.replaceAll("\n", ' ').replaceAll("\r", ''),
                    stdInElement.selectionStart, stdInElement.selectionEnd, 'end'
                );
            }
            //stdInElement.value = stdInElement.value.substring(0, stdInElement.selectionStart) + clipboardText + stdInElement.value.substring(stdInElement.selectionEnd);
            if(!window.getSelection().toString() && !(document.activeElement == stdInElement)) stdInElement.focus();
        });
    }

    stdInElement.addEventListener('paste', function (event) {
        clearAutoComp();

        const clipboardData = event.clipboardData || window.clipboardData;
        let pastedText = clipboardData.getData('text');

        if (session.allowMultiLines || (!pastedText.includes("\n") && !pastedText.includes("\r"))) return;

        event.preventDefault();

        pastedText = pastedText.replaceAll("\n", ' ').replaceAll("\r", '');

        stdInElement.setRangeText(pastedText, stdInElement.selectionStart, stdInElement.selectionEnd, 'end');
    });
}

/* copy paste like terminal */


/* clear history */

function clearHistory() {
    history = [];
    currentHistoryElement = 0;

    // clear process histories
    const processHasHistory = Object.keys(commands).filter(cmd => {
        const cmdObj = commands[cmd];
        return cmdObj.history && typeof cmdObj.history !== "boolean" && cmdObj.history.length > 0
    });

    for (let i = 0; i < processHasHistory.length; i++) {
        commands[processHasHistory[i]].history = undefined;
    }

    // if rememberHistory option is enabled
    if (localStorage.history)
        localStorage.removeItem("history");
}

/* clear history */


/* scroll with keyboard like terminal */

mainDiv.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.shiftKey && event.key == "ArrowUp") {

        event.preventDefault();

        scroll.by(-200);
    }
    if (event.ctrlKey && event.shiftKey && event.key == "ArrowDown") {

        event.preventDefault();

        scroll.by(200);
    }

});

/* scroll with keyboard like terminal */

/* home and end buttons */

window.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key == "Home") {
        event.preventDefault();
        scroll.toStart();
    }
    if (event.ctrlKey && event.key == "End") {
        event.preventDefault();
        scroll.toEnd();
    }

});

/* home and end buttons */


/* reload all scripts */

function reloadScripts() {
    document.querySelectorAll('script[src]').forEach(oldScript => {
        const src = oldScript.getAttribute('src');
        const newScript = document.createElement('script');
        newScript.src = src + '?reload=' + new Date().getTime();
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/* reload all scripts */


/* on load */

(async function() {

    manifest = await (await request("./manifest.json")).json();
    settings = await (await request("./settings.json")).json();

    aliases = {...settings.aliases, ...aliases};
    settings.bookmarks = settings.bookmarks;

    const colorScheme = settings.color_scheme && (settings.color_scheme.toLowerCase() !== "system") ? settings.color_scheme.toLowerCase() : (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    switch (colorScheme) {
        case "dark":
        case "light":
        case "system":
            colorSchemeLinkElement.href = "./themes/" + colorScheme + ".css";
            break;

        default:
            stdout.error("Unknown color scheme: " + colorScheme);
            colorSchemeLinkElement.href = "./themes/dark.css";
            break;
    }

    applyThemes();

    loadFavicon();

    for (let i = 0; i < settings.modules.length; i++) {
        const moduleName = settings.modules[i];
        loadModuleDom(moduleName);
    }

    if (settings.effective_time) {
        timeInterval = setInterval(() => {
            if (times)
                for (let i = 0; i < times.length; i++) {
                    const element = times[i];
                    element.innerHTML = new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                }
            if (time24s)
                for (let i = 0; i < time24s.length; i++) {
                    const element = time24s[i];
                    element.innerHTML = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                }
        }, 1000);
    }

    session.rawPrefix = settings.user + "@" + (settings.host ?? getBrowserType()) + ":~#&nbsp;";

    nameChange();

    session.autoCompList = [...Object.keys(commands).filter(el => el.length > 1), ...Object.keys(aliases).filter(el => el.length > 1)].filter(el => el.length > 1);

    if (settings.allow_load_script) await fetch("./load.sh").then(async res => await res.text()).then(async (loadScript) => {
        if (!(loadScript === "")) await executeScript(loadScript);
    });

    initCopyPasteLikeTerminal();

    form.style.display = "flex";
    scroll.toEnd();

    mainDiv.style.display = "inline-block";

    if (
        document.activeElement === document.body &&
        window.location.host !== "localhost" &&
        window.location.host !== "127.0.0.1:3000"
    ) {
        stdInElement.focus();
    }
})();

/* on load */


/* print to stdout on error */

window.onerror = function(message, source, lineno, colno, error) {
    console.error(error);

    stdout.log(Fore.Red + error.stack + " (at " + source.split("?")[0].replace("chrome-extension://" + chrome.runtime.id, "") + ":" + lineno + ":" + colno + ")" + Reset);

    return true;
};

/* print to stdout on error */


/* input button events */

stdInElement.addEventListener("keydown", async (event) => {

    if (!event.shiftKey && event.key == "Enter" && !window.getSelection().toString()) {

        if (session.reading) return;

        event.preventDefault();

        if(thisProcess !== undefined) {
            const input = stdout.startProcess(thisProcessPrefix);
            let result;

            try {
                result = await commands[thisProcess].func(parseInput(thisProcess + " " + input), true);
            } catch (error) {
                stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);

                session.allowMultiLines = false;
                prefixElement.innerHTML = session.defaultPrefix;

                try {
                    await commands[thisProcess].beforeExit(false, true);
                } catch (error) {
                    stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                }

                restoreAutoCompList();
                restoreHistory(commands[thisProcess]);

                thisProcess = undefined;
                if (result !== 0)
                    stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + result + Fore.Reset);

                stdout.exitProcess();
                return;
            }

            if (typeof result === "string") {
                thisProcessPrefix = result;
                prefix.innerHTML = thisProcessPrefix;
                if (commands[thisProcess].autoComplete) session.autoCompList = [...commands[thisProcess].autoComplete];
                stdout.exitProcess();
            }
            else {
                session.allowMultiLines = false;
                prefixElement.innerHTML = session.defaultPrefix;

                if (commands[thisProcess].beforeExit) {
                    try {
                        await commands[thisProcess].beforeExit(false);
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }

                restoreAutoCompList();
                restoreHistory(commands[thisProcess]);

                thisProcess = undefined;

                stdout.exitProcess();
            }

            clearAutoComp();
            return;
        };

        const input = stdout.startProcess();

        if(input === "" || input.startsWith("#")) {
            stdout.exitProcess();
            clearAutoComp();
            return;
        };

        const process = parseInput(input);
        
        if (commands[process.command]) {
            thisProcess = process.command;
            let result;

            try {
                result = await commands[process.command].func(process);
            } catch (error) {
                stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);

                clearAutoCompList();
                backupHistory(commands[process.command]);

                session.allowMultiLines = false;
                prefixElement.innerHTML = session.defaultPrefix;

                if (commands[process.command].beforeExit) {
                    try {
                        await commands[process.command].beforeExit(false, true);
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }

                restoreAutoCompList();
                restoreHistory(commands[process.command]);

                thisProcess = undefined;

                stdout.exitProcess();

                clearAutoComp();

                return;
            }

            clearAutoCompList();
            backupHistory(commands[process.command]);

            if (typeof result === "string") {
                thisProcessPrefix = result;
                prefixElement.innerHTML = thisProcessPrefix;
                stdout.exitProcess();
                if (commands[thisProcess].autoComplete) session.autoCompList = [...commands[thisProcess].autoComplete];
                clearAutoComp();
                return;
            }
            else {
                session.allowMultiLines = false;
                prefixElement.innerHTML = session.defaultPrefix;

                if (commands[process.command].beforeExit) {
                    try {
                        await commands[process.command].beforeExit(false);
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }

                restoreAutoCompList();
                restoreHistory(commands[process.command]);

                thisProcess = undefined;
                if (result !== 0)
                    stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + result + Fore.Reset);

                stdout.exitProcess();

                clearAutoComp();
                return;
            }
        }

        else if (process.command in aliases && aliases[process.command] in commands) {
            thisProcess = aliases[process.command];
            let result;

            try {
                result = await commands[aliases[process.command]].func(process);
            } catch (error) {
                stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);

                clearAutoCompList();
                backupHistory(commands[aliases[process.command]]);

                session.allowMultiLines = false;
                prefixElement.innerHTML = session.defaultPrefix;

                if (commands[aliases[process.command]].beforeExit) {
                    try {
                        await commands[aliases[process.command]].beforeExit(false, true);
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }

                restoreAutoCompList();
                restoreHistory(commands[aliases[process.command]]);

                thisProcess = undefined;

                stdout.exitProcess();

                clearAutoComp();
                return;
            }

            clearAutoCompList();
            backupHistory(commands[aliases[process.command]]);

            if (typeof result === "string") {
                thisProcessPrefix = result;
                prefixElement.innerHTML = thisProcessPrefix;
                stdout.exitProcess();
                if (commands[thisProcess].autoComplete) session.autoCompList = [...commands[thisProcess].autoComplete];
                clearAutoComp();
                return;
            }
            else {
                session.allowMultiLines = false;
                prefixElement.innerHTML = session.defaultPrefix;

                if (commands[aliases[process.command]].beforeExit) {
                    try {
                        await commands[aliases[process.command]].beforeExit(false);
                    } catch (error) {
                        stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
                    }
                }

                restoreAutoCompList();
                restoreHistory(commands[aliases[process.command]]);

                thisProcess = undefined;
                if (result !== 0)
                    stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bold + result + Fore.Reset);

                stdout.exitProcess();

                clearAutoComp();
                return;
            }
        }
        
        else {
            stdout.error("Command not found.");
        }

        thisProcess = undefined;

        stdout.exitProcess();

        clearAutoComp();

    }

    else if (event.shiftKey && event.key == "Enter" && !session.allowMultiLines) {

        event.preventDefault();
        return;

    }

    else if (
        (
            event.key == "ArrowUp" &&
            !(event.ctrlKey && event.shiftKey) &&
            !session.allowMultiLines
        ) ||
        (
            event.key == "ArrowUp" &&
            !(event.ctrlKey && event.shiftKey) &&
            session.allowMultiLines &&
            (
                stdInElement.rows == 1 ||
                (
                    stdInElement.selectionStart == stdInElement.selectionEnd &&
                    !stdInElement.value.substring(0, stdInElement.selectionStart).includes('\n')
                )
            )
        )
    ) {

        if (session.reading) return;

        event.preventDefault();

        if (currentHistoryElement > 0) {

            stdInElement.value = history[--currentHistoryElement];

            clearAutoComp();
            autoComplete();

            if (!session.allowMultiLines) return;
            const rows = stdInElement.value.split("\n").length;
            if (rows !== stdInElement.rows)
                stdInElement.rows = rows;
        }

    }

    else if (
        (
            event.key == "ArrowDown" &&
            !(event.ctrlKey && event.shiftKey) &&
            !session.allowMultiLines
        ) ||
        (
            event.key == "ArrowDown" &&
            !(event.ctrlKey && event.shiftKey) &&
            session.allowMultiLines &&
            (
                stdInElement.rows == 1 ||
                (
                    stdInElement.selectionStart == stdInElement.selectionEnd &&
                    !stdInElement.value.substring(stdInElement.selectionStart).includes('\n')
                )
            )
        )
    ) {

        if (session.reading) return;

        event.preventDefault();

        if (currentHistoryElement < history.length) {

            stdInElement.value = history[++currentHistoryElement] ?? "";

            clearAutoComp();
            autoComplete();

            if (!session.allowMultiLines) return;
            const rows = stdInElement.value.split("\n").length;
            if (rows !== stdInElement.rows)
                stdInElement.rows = rows;
        }

    }

    else if (event.ctrlKey && event.key == "c" && thisProcess !== undefined && !window.getSelection().toString()) {

        if (session.reading) return;

        session.allowMultiLines = false;
        prefixElement.innerHTML = session.defaultPrefix;

        if (commands[thisProcess].beforeExit) {
            try {
                const result = await commands[thisProcess].beforeExit(true);

                if (typeof result === "string") {
                    thisProcessPrefix = result;
                    prefixElement.innerHTML = thisProcessPrefix;
                    stdout.exitProcess();
                    if (commands[thisProcess].autoComplete) session.autoCompList = [...commands[thisProcess].autoComplete];
                    clearAutoComp();
                    return;
                }
            } catch (error) {
                stdout.log(Fore.Red + error.stack.replaceAll(window.location.origin, "") + Reset);
            }
        }

        restoreAutoCompList();
        restoreHistory(commands[thisProcess]);

        thisProcess = undefined;
        stdout.exitProcess();

        clearAutoComp();
    }

    /* else if (
        (
            !thisProcess ||
            window.getSelection().toString() !== ""
        ) &&
        event.shiftKey &&
        event.key == "Enter"
    )
        event.preventDefault(); */

    else if (session.allowMultiLines && event.shiftKey && event.key == "Enter")
        stdInElement.rows++;

    else if (event.key == "Tab") {

        if (session.reading) return;

        event.preventDefault();

        if (!settings["enable_auto_complete"]) return;

        if (autoComp.textContent == "") {

            if (session.autoCompListNow.length == 0) return;

            if (session.autoCompListNow.length == 1) session.autoCompIndex = 0;

            if (event.shiftKey) {
                if (session.autoCompIndex === 0)
                    session.autoCompIndex = session.autoCompListNow.length -1;
                else
                    session.autoCompIndex--;
            } else {
                if (session.autoCompIndex === session.autoCompListNow.length -1)
                    session.autoCompIndex = 0;
                else
                    session.autoCompIndex++;
            }
        }

        if (!session.originalInput) {
            session.originalInput = stdInElement.value;
        }
        stdInElement.value = session.autoCompListNow[session.autoCompIndex];
        autoComp.innerHTML = "";
    }

    else if (event.key == "Escape") {

        if (session.reading) return;

        if (session.autoCompListNow.length == 0) return;

        if (session.originalInput) {
            stdInElement.value = session.originalInput;
            session.originalInput = undefined;
        }

        session.autoCompIndex = 0;
        autoComp.innerHTML = "";
    }

    else if (event.key == "Backspace") {

        if (session.reading) return;

        currentHistoryElement = history.length;
    }

    else if ((event.key == "l" || event.key == "L") && event.ctrlKey) {
        event.preventDefault();
        stdout.clear();

        if (event.key == "L") {
            clearHistory();
        }
    }

});

stdInElement.addEventListener("input", autoComplete);

// for multi line inputs
stdInElement.addEventListener("input", function () {
    if (!session.allowMultiLines) return;
    const rows = stdInElement.value.split("\n").length;
    if (rows !== stdInElement.rows)
        stdInElement.rows = rows;
});

/* input button events */
