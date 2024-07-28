/* constant values */

const history = [];

let _echo = true;

let currentHistoryElement = 0;

const user = document.getElementById("user");
const host = document.getElementById("host");
const prefix = document.getElementById("prefix");
const form = document.getElementById("form");
const mainDiv = document.getElementById("main");
const stdIn = document.getElementById("std-in");
const stdOut = document.getElementById("std-out");

let pref = prefix.innerHTML;

let rawPrefix;

const ansi_up = new AnsiUp;
ansi_up.use_classes = true;

const math = new lzar();

let bookmarks, settings, manifest, aboutContent;

let times, time24s, timeInterval;

let allowMultiLines = true;

let IPv4, IPv6, ip_location, ISP;

const defaultLog = console.log;

let ipInfoText;

let thisProcess, thisProcessPrefix;

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

let aliases = {
    "cls": "clear",
    "h": "help",
    "?": "help",
    "s": "search",
    "reboot": "reload",
    "shutdown": "close",
    "weather": "wttr.in",
    "wttr": "wttr.in",
    "cht_sh": "cht.sh",
    "js": "javascript",
    "calculator": "calc",
    "math": "calc",
    "lzar": "calc",
    "open": "openurl",
    "ip": "ipinfo",
    "ipconfig": "ipinfo",
    "@ECHO": "@echo"
}

/* constant values */


/* get history from localStorage */

if(localStorage.history){
    history.push(...JSON.parse(localStorage.history));
    currentHistoryElement = history.length;
}

/* get history from localStorage */


/* Class for stdout file output */

const stdout = {
    // write input and add line break to output
    log: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += text + "<br>"
            return;
        }
        stdOut.innerHTML += ansi_up.ansi_to_html(text+"\n").replaceAll("\n", "<br>")
    },
    // write error and add line break to output
    error: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += ansi_up.ansi_to_html(Fore.Red + "Error" + Fore.Reset + ": ").replaceAll("\n", "<br>") + text + "<br>"
        }
        stdOut.innerHTML += ansi_up.ansi_to_html(Fore.Red + "Error" + Fore.Reset + ": " + text + "\n").replaceAll("\n", "<br>")
    },
    // write input to output
    write: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += text
        }
        stdOut.innerHTML += ansi_up.ansi_to_html(text).replaceAll("\n", "<br>")
    },
    // clear console
    clear: function () {
        stdOut.innerHTML = "";
    },
    // start command process
    startProcess: function (thisPrefix = prefix.innerHTML) {

        stdIn.setAttribute("rows", "1");

        stdOut.innerHTML += thisPrefix +
            stdIn.value +
            "<br>";

        if(stdIn.value != "" && thisProcess === undefined) history.push(stdIn.value);
        currentHistoryElement = history.length;

        if(settings.remebmerHistory)
            localStorage.setItem("history", JSON.stringify(history));

        form.style.display = "none";

    },
    // exit command process
    exitProcess: function () {
        stdIn.value = "";
        form.style.display = "flex";
        mainDiv.scrollTop = mainDiv.scrollHeight;
        stdIn.focus();
    },
}

/* Class for stdout file output */


/* Function for get command aliases */

function getAliases(command) {

    let commandAliases = " Aliases: ";

    // loop for all aliases
    for (const [key, value] of Object.entries(aliases)) {
        // if this aliases for input command
        if (value === command) {
            commandAliases += key + ", ";
        }
    }

    if (commandAliases == " Aliases: ") {
        return "";
    }

    return commandAliases.slice(0, -2);
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
    const regex = /(?:[^\s"]+|"[^"]*")+/g;

    // match arguments
    const args = input.match(regex).map(arg => arg.replace(/(^"|"$)/g, ''));

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
                    i += 1;
                }
            } else {

                options[key] = true;
                i += 1;
            }
        } else {

            // if this is a command name
            if (i===0) i += 1;

            else {

                if (_ === "") {

                    _ = arg;
                } else {

                    _ += " " + arg;
                }

                i += 1;
            }
        }
    }

    const command = argv.shift();

    return { command, argv, options, _ };
}

/* Function for parse arguments */


/* Function for get browser name */

function getBrowserType() {
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


/* chanage names on load */

function nameChange() {
    
    // change host text with browser name
    host.innerHTML = settings.host ?? getBrowserType();


    // change user text with user name
    user.innerHTML = settings.user;

    // change title text with tab name
    document.title = settings.title;

    pref = prefix.innerHTML;

}

/* chanage names on load */


/* commands */

const commands = {
    "test": {
        func: async function (process) {
            stdout.log("\n\n\x1b[1;33;40m 33;40  \x1b[1;33;41m 33;41  \x1b[1;33;42m 33;42  \x1b[1;33;43m 33;43  \x1b[1;33;44m 33;44  \x1b[1;33;45m 33;45  \x1b[1;33;46m 33;46  \x1b[1m\x1b[0m\n\n\x1b[1;33;42m >> Tests OK\x1b[0m\n\n");
            return 0;
        },
        about: `Test command.%ALIASES%`
    },
    "@echo": {
        func: async function (process) {
            if (process._.toLowerCase() == "on") {
                prefix.innerHTML = pref;
            } else if (process._.toLowerCase() == "off") {
                prefix.innerHTML = "";
            }
            return 0;
        },
        about: `Switch echo on/off.%ALIASES%\nExample:\n $ @echo on\n $ @echo off`
    },
    "cat": {
        func: async function (process, isInput = false) {

            // if is std input
            if(isInput) {
                stdout.log(process._, true);

                // set std input prefix
                return "";
            }

            // if no argument
            if (process._ == "") {

                // set std input prefix
                return "";
            }

            // if argument is a url
            const res = await fetch(process._);

            // if connection error
            const err = res.status !== 200 ? res.status : null;
            if (err) {
                // log error code
                stdout.error("Response returned " + Fore.Bright + Fore.Red + err + Fore.Reset + " code.");
                // exit with error code
                return err;
            }

            const data = await res.text();

            // log file content
            stdout.log(data, true);

            // exit
            return 0;
        },
        about: `Read file content.%ALIASES%\nExamples:\n $ cat ./file.txt\n $ cat https://example.com/file.txt`
    },
    "echo": {
        func: async function (process, isInput = false) {

            // if no argument
            if (process._ == "") {

                // set std input prefix
                return "";
            }

            stdout.log(process._, false);

            // if is std input
            if(isInput)
                // set std input prefix
                return "";

            return 0;
        },
        about: `Echo command.%ALIASES%`
    },
    "reload": {
        func: async function (process) {
            window.location.reload(false);
            return 0;
        },
        about: `Reload page.%ALIASES%`
    },
    "close": {
        func: async function (process) {
            window.close();
            return 0;
        },
        about: `Close page.%ALIASES%`
    },
    "clear": {
        func: async function (process) {
            stdout.clear();
            if (process.options.all && localStorage.history)
                localStorage.removeItem("history");
            return 0;
        },
        about: `Clear console.%ALIASES%\n Flags:\n  --all - Clear console with history\n Examples:\n  $ clear\n  $ clear --all`
    },
    "bash": {
        func: async function (process) {
            await fetch(process._).then(res => res.text()).then(async (scriptContent) => {
                if (!(scriptContent === ""))
                    // execute script
                    await executeScript(scriptContent);
            });
            return 0;
        },
        about: `Run script.%ALIASES%\nExample:\n $ bash ./file.sh\n $ bash https://example.com/script.sh`
    },
    "sh": {
        func: async function (process, isInput = false) {

            // if is std input
            if(isInput) {

                // parse input arguments
                const inputProcess = parseInput(process._);

                // execute command
                if (commands[inputProcess.command]) {

                    // execute command and get reuturned code
                    const result = await commands[inputProcess.command].func(inputProcess);

                    // if returned error
                    if (result !== 0)
                        // log error code
                        stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
                }
                
                // execute command if alias exists
                else if (inputProcess.command in aliases) {

                    // execute command and get reuturned code
                    const result = await commands[aliases[inputProcess.command]].func(inputProcess);

                    // if returned error
                    if (result !== 0)
                        // log error code
                        stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
                }
                
                // if command not found
                else {
                    stdout.error("Command not found.");
                }

                // set std input prefix
                return rawPrefix;
            }
            if (process._ == "") {

                // set std input prefix
                return rawPrefix;
            }

            // exit
            return 0;
        },
        about: `Execute input.%ALIASES%`
    },
    "ipinfo": {
        func: async function (process) {

            // write ip information
            stdout.log(ipInfoText);

            // exit
            return 0;
        },
        about: `Print system ip information.%ALIASES%\nExample:\n $ ipinfo`
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
            if (process.options["24h"] || (!process.options["12h"] && settings.timeHours == 24)) {

                const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                stdout.log("<span class=\"time24\">" + time + "</span>", false);

            }

            // if used with --24h or default time format is 24 hours
            else if (process.options["12h"] || (!process.options["24h"] && settings.timeHours == 12)) {

                const time = new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                stdout.log("<span class=\"time\">" + time + "</span>", false);

            }

            effectiveTime();

            // exit
            return 0;
        },
        about: `Print system time.%ALIASES%\nFlags:\n --set: enable effective time\n --kill: disable effective time\n --24h: print time in 24 hours\nExamples:\n $ time\n $ time --24h\n $ time --12h`
    },
    "about": {
        func: async function (process) {
            stdout.log(aboutContent);
            return 0;
        },
        about: `Print information.%ALIASES%`
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
        about: `Print system date.%ALIASES%\nExamples:\n $ date\n $ date --long`
    },
    "javascript": {
        func: async function (process, isInput = false) {

            // if is std input allow shift + enter for multiline input
            if(isInput) allowMultiLines = true;

            // if no arguments
            if (process._ == "") {

                // set std input prefix
                return "";
            }

            // change console log to write to std out
            console.log = content => {
                stdOut.innerHTML += content+"\n";
            }

            let output;

            // create try-catch block for blocking errors
            try {
                // evaluate input and log output
                output = eval(process._);
                stdout.log(Fore.Gray + output + Fore.Reset);
            } catch (error) {
                // if error log it
                stdout.log(error);
            }

            // change console log back
            console.log = defaultLog;

            // if is std input
            if(isInput)
                // set std input prefix to empty
                return "";

            // exit
            return 0;
        },
        about: `Execute JavaScript code.%ALIASES%\nExamples:\n $ js console.log("Hello, World!")`
    },
    "bookmarks": {
        func: async function (process) {
            stdout.log(
                await (
                    async ()=>{

                        let out = "";

                        for await (const [key, value] of Object.entries(bookmarks)) {
                            out += Fore.BrightBlue + key + Fore.Reset + ": " + Fore.Blue + value + Fore.Reset + "\n";
                        }

                        return out.slice(0, -1);
                    }
                )()
            );
            return 0;
        },
        about: `Print all bookmarks.%ALIASES%\nExamples:\n $ bookmarks`
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
        about: `Start program with custom URL Protocol.%ALIASES%\nExamples:\n $ start steam`
    },
    "calc": {
        func: async function (process, isInput = false) {

            // if no arguments
            if (process._ == "") {

                // set std input prefix to empty
                return "";
            }

            stdout.log(math.calc(process._));

            // if is std input
            if(isInput)
                // set std input prefix to empty
                return "";

            // exit
            return 0;
        },
        about: `Calculator.%ALIASES%\nExamples:\n $ calc 2+2\n $ math 2+2`
    },
    "tdk": {
        func: async function (process, isInput = false) {

            // if no arguments
            if (process._ == "") {

                // set std input prefix to empty
                return "";
            }

            // else make request
            const url = "https://sozluk.gov.tr/gts?ara=" + encodeURI(process._);
            const res = await fetch(url);
            const data = await res.json();

            // format output with tdk function in "scripts/tdk.js" file and log
            stdout.log(tdk(data));

            // if is std input
            if(isInput)
                // set std input prefix to empty
                return "";

            // exit
            return 0;
        },
        about: `TDK dictionary api.%ALIASES%\nExamples:\n $ tdk merhaba`
    },
    "go": {
        func: async function (process) {
            if (process.options.b) {
                if (!bookmarks[process._]) {
                    stdout.error("Bookmark not found.");
                    return 1;
                }
                window.open(bookmarks[process._], "_blank");
            } else {
                if (!bookmarks[process._]) {
                    stdout.error("Bookmark not found.");
                    return 1;
                }
                window.open(bookmarks[process._], "_self");
            }
            return 0;
        },
        about: `Go bookmark.%ALIASES%\nFlags: -b: open in new tab\nExamples:\n $ go github\n $ go -b github"`
    },
    "openurl": {
        func: async function (process) {
            if (process.options.s) {
                window.open(process._, "_self");
                return 0;
            }
            window.open(process._, "_blank");
            return 0;
        },
        about: `Open url.%ALIASES%\nFlags: -s: open in this tab\nExamples:\n $ openurl https://example.com`
    },
    "wttr.in": {
        func: async function (process) {
            if (process.options.c) {
                const url = "https://wttr.in/" + process._
                const response = await fetch(url);
                const data = await response.text();
                stdout.log(data);
                return 0;
            }
            const location = (()=>{
                if (process._) {
                    return process._;
                } else {
                    return settings.location;
                }
            })();
            const url = "https://wttr.in/" +
                location +
                "?0nA&lang=" +
                settings.language;
            try {
                const response = await fetch(url);
                const status = response.status;
                if (status !== 200) {
                    return status;
                }
                const data = await response.text();
                stdout.log(data);
                return 0;
            } catch (error) {
                stdout.error(error);
                return 0;
            }
        },
        about: `Show weather.%ALIASES%\nFlags: -c: custom options\nExamples:\n $ wttr.in\n $ wttr İstanbul\n $ wttr -c İstanbul?0nA&lang=en`
    },
    "search": {
        func: async function (process) {
            if (!process._ || process._ == "") {
                stdout.error("Please enter a search term.");
                return 1;
            }
            if (process.options.b) {
                window.open(settings["search-engine-url"].replace("$1", process._), "_blank");
            } else {
                window.open(settings["search-engine-url"].replace("$1", process._), "_self");
            }
            return 0;
        },
        about: `Search in the web.%ALIASES%\nFlags: -b: open in new tab\nExamples:\n $ search sanalzio\n $ s -b sanalzio`
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
        about: `Show help.%ALIASES%\nExamples:\n $ help\n $ help cat`
    },
}

/* commands */


/* execute command function */

async function execute(command) {

    let exitCode = 0;

    // disable writing preffix and command
    /* stdOut.innerHTML += prefix.innerHTML +
        command +
        "<br>";
    
    form.style.display = "none"; */



    if(command === "" || command.startsWith("#")) exitCode = 0;

    const process = parseInput(command);
        
    if (commands[process.command]) {
        exitCode = await commands[process.command].func(process);
        if (exitCode !== 0) {
            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + exitCode + Fore.Reset);
        }
    }

    else if (process.command in aliases) {
        exitCode = await commands[aliases[process.command]].func(process);
        if (exitCode !== 0) {
            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + exitCode + Fore.Reset);
        }
    }

    form.style.display = "flex";
    mainDiv.scrollTop = mainDiv.scrollHeight;

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
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + exitCode + Fore.Reset);
            }
        }

        else if (process.command in aliases) {
            exitCode = await commands[aliases[process.command]].func(process);
            if (exitCode !== 0) {
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + exitCode + Fore.Reset);
            }
        }
        
    }
    
    form.style.display = "flex";
    mainDiv.scrollTop = mainDiv.scrollHeight;
    
}

/* execute script function */


/* auto focus to #std-in */

mainDiv.addEventListener("click", (event) => {
    if(!window.getSelection().toString() && !(document.activeElement == stdIn)) stdIn.focus();
});

stdIn.addEventListener("input", (event) => {
    mainDiv.scrollTop = mainDiv.scrollHeight;
});

/* auto focus to #std-in */


/* copy paste like terminal */

window.addEventListener("keydown", async (event) => {

    if (event.key == "Enter" && window.getSelection().toString()) {
        event.preventDefault();

        await navigator.clipboard.writeText(window.getSelection().toString());
        window.getSelection().removeAllRanges();
    }

});

mainDiv.addEventListener("contextmenu", async (event) => {
    event.preventDefault();

    const clipboardText = await navigator.clipboard.readText();
    stdIn.value = stdIn.value.substring(0, stdIn.selectionStart) + clipboardText + stdIn.value.substring(stdIn.selectionEnd);
    if(!window.getSelection().toString() && !(document.activeElement == stdIn)) stdIn.focus();
    mainDiv.scrollTop = mainDiv.scrollHeight;
});

/* copy paste like terminal */


/* scroll with keyboard like terminal */

mainDiv.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key == "ArrowUp") {

        event.preventDefault();

        mainDiv.scrollBy(0, -100);
    }
    if (event.ctrlKey && event.shiftKey && event.key == "ArrowDown") {

        event.preventDefault();

        mainDiv.scrollBy(0, 100);
    }
});

/* scroll with keyboard like terminal */


/* on load */

document.addEventListener('DOMContentLoaded', async function() {

    form.style.display = "none";

    const manifestRes = await fetch("./manifest.json");
    manifest = await manifestRes.json();

    settings = manifest.terminal_settings;
    aliases = {...manifest.aliases, ...aliases};
    bookmarks = manifest.bookmarks;

    if (settings.effectiveTime) {
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

    try {
        const wtfismyipRES = await fetch("https://wtfismyip.com/json");
        const wtfismyipSJON = await wtfismyipRES.json();
    
        IPv6 = wtfismyipSJON["YourFuckingIPAddress"];
        ip_location = wtfismyipSJON["YourFuckingLocation"];
        ISP = wtfismyipSJON["YourFuckingISP"];
    
        const httpbinRES = await fetch("https://httpbin.org/ip", { "mode" : "cors" });
        const httpbinJSON = await httpbinRES.json();
    
        IPv4 = httpbinJSON.origin;
    } catch (error) {
        console.log(error);
        IPv6, ip_location, ISP, IPv4 = "?";
    }

    rawPrefix = settings.user + "@" + (settings.host ?? getBrowserType()) + ":~#&nbsp;"

    nameChange();

    aboutContent = `
 ${Fore.BrightBlue}version${Fore.Reset}: ${Fore.Blue}${manifest.version}${Fore.Reset}
 ${Fore.BrightBlue}font family${Fore.Reset}: ${Fore.Blue}${window.getComputedStyle(mainDiv).fontFamily}${Fore.Reset}
 ${Fore.BrightBlue}search engine${Fore.Reset}: ${Fore.Blue}${settings["search-engine-url"].split("/")[2]}${Fore.Reset}

 ${Fore.Red}█${Fore.Reset} ${Fore.Green}█${Fore.Reset} ${Fore.Yellow}█${Fore.Reset} ${Fore.Blue}█${Fore.Reset} ${Fore.Magenta}█${Fore.Reset} ${Fore.Cyan}█${Fore.Reset} ${Fore.White}█${Fore.Reset} ${Fore.Gray}█${Fore.Reset}
 ${Fore.BrightRed}█${Fore.Reset} ${Fore.BrightGreen}█${Fore.Reset} ${Fore.BrightYellow}█${Fore.Reset} ${Fore.BrightBlue}█${Fore.Reset} ${Fore.BrightMagenta}█${Fore.Reset} ${Fore.BrightCyan}█${Fore.Reset} ${Fore.BrightWhite}█${Fore.Reset}
`;
    ipInfoText = `
 ${Fore.BrightBlue}IPv4${Fore.Reset}     : ${Fore.Blue}${IPv4}${Fore.Reset}
 ${Fore.BrightBlue}IPv6${Fore.Reset}     : ${Fore.Blue}${IPv6}${Fore.Reset}
 ${Fore.BrightBlue}ISP${Fore.Reset}      : ${Fore.Blue}${ISP}${Fore.Reset}
 ${Fore.BrightBlue}Location${Fore.Reset} : ${Fore.Blue}${ip_location}${Fore.Reset}
`;
    if (settings.allowLoadScript) await fetch("./load.sh").then(async res => await res.text()).then(async (loadScript) => {
        if (!(loadScript === "")) await executeScript(loadScript);
    });

    form.style.display = "flex";
    mainDiv.scrollTop = mainDiv.scrollHeight;

    mainDiv.style.display = "inline-block";

    if (
        document.activeElement === document.body &&
        window.location.host !== "localhost" &&
        window.location.host !== "127.0.0.1:3000"
    ) {
        stdIn.focus();
    }
});

/* on load */


/* input button events */

stdIn.addEventListener("keydown", async (event) => {

    if (!event.shiftKey && event.key == "Enter" && !window.getSelection().toString()) {

        event.preventDefault();

        if(thisProcess !== undefined) {
            stdout.startProcess(thisProcessPrefix);
            await commands[thisProcess].func({command: thisProcess, _: stdIn.value}, true);
            stdout.exitProcess();
            return;
        };

        stdout.startProcess();

        if(stdIn.value === "" || stdIn.value.startsWith("#")) {
            stdout.exitProcess();
            return;
        };

        const process = parseInput(stdIn.value);
        
        if (commands[process.command]) {
            thisProcess = process.command;
            const result = await commands[process.command].func(process);
            if (typeof result === "string") {
                thisProcessPrefix = result;
                prefix.innerHTML = thisProcessPrefix;
                stdout.exitProcess();
                return;
            }
            else if (result !== 0)
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
        }

        else if (process.command in aliases) {
            thisProcess = aliases[process.command];
            const result = await commands[aliases[process.command]].func(process);
            if (typeof result === "string") {
                thisProcessPrefix = result;
                prefix.innerHTML = thisProcessPrefix;
                stdout.exitProcess();
                return;
            }
            else if (result !== 0)
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
        }
        
        else {
            stdout.error("Command not found.");
        }

        thisProcess = undefined;

        stdout.exitProcess();

    }

    else if (!thisProcess && event.key == "ArrowUp" && !(event.ctrlKey && event.shiftKey)) {

        event.preventDefault();

        if (currentHistoryElement > 0) {

            stdIn.value = history[currentHistoryElement -1];
            
            if(currentHistoryElement > 1)
                currentHistoryElement -= 1;
            
        }

    }

    else if (!thisProcess && event.key == "ArrowDown" && !(event.ctrlKey && event.shiftKey)) {

        event.preventDefault();

        if (currentHistoryElement - 1 < history.length) {

            stdIn.value = history[currentHistoryElement] ?? "";
            
            if(currentHistoryElement < history.length)
                currentHistoryElement += 1;

        }

    }

    else if (event.ctrlKey && event.key == "c" && thisProcess !== undefined && !window.getSelection().toString()) {
        allowMultiLines = false;
        prefix.innerHTML = pref;
        thisProcess = undefined;
        stdout.exitProcess();
    }

    else if (
        (
            !thisProcess ||
            window.getSelection().toString() !== ""
        ) &&
        event.shiftKey &&
        event.key == "Enter"
    )
        event.preventDefault();

    else if (allowMultiLines && event.shiftKey && event.key == "Enter")
        stdIn.setAttribute("rows", (Number(stdIn.getAttribute("rows")) + 1).toString());

});

/* input button events */
