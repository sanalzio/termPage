/* constant values */

const stdout = {
    log: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += text + "<br>"
            return;
        }
        stdOut.innerHTML += ansi_up.ansi_to_html(text+"\n").replaceAll("\n", "<br>")
    },
    error: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += ansi_up.ansi_to_html(Fore.Red + "Error" + Fore.Reset + ": ").replaceAll("\n", "<br>") + text + "<br>"
        }
        stdOut.innerHTML += ansi_up.ansi_to_html(Fore.Red + "Error" + Fore.Reset + ": " + text + "\n").replaceAll("\n", "<br>")
    },
    write: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += text
        }
        stdOut.innerHTML += ansi_up.ansi_to_html(text).replaceAll("\n", "<br>")
    },
    clear: function () {
        stdOut.innerHTML = "";
    },
    startProcess: function (thisPrefix = prefix.innerHTML) {

        stdIn.setAttribute("rows", "1");

        stdOut.innerHTML += thisPrefix +
            stdIn.value +
            "<br>";

        if(stdIn.value != "") history.push(stdIn.value);
        currentHistoryElement = history.length;

        form.style.display = "none";

    },
    exitProcess: function () {
        stdIn.value = "";
        form.style.display = "flex";
        mainDiv.scrollTop = mainDiv.scrollHeight;
        stdIn.focus();
    },
}

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


/* Function for get command aliases */

function getAliases(command) {

    let commandAliases = " Aliases: ";

    for (const [key, value] of Object.entries(aliases)) {
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
    const argv = [];
    let _ = "";
    const options = {};
    const regex = /(?:[^\s"]+|"[^"]*")+/g;
    const args = input.match(regex).map(arg => arg.replace(/(^"|"$)/g, ''));

    let i = 0;
    while (i < args.length) {
        argv.push(args[i]);
        if (args[i].startsWith('-')) {
            const key = args[i].replace(/^--?/, '');
            if ((i + 1) < args.length && !args[i + 1].startsWith('-')) {
                if (args[i].startsWith('--')) {
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
            if (i===0) i += 1;
            else {
                if (_ === "") {
                    _ = args[i];
                } else {
                    _ += " " + args[i];
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
        return "host";
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
            if(isInput) {
                stdout.log(process._, true);
                return "";
            }
            if (process._ == "") {
                return "";
            }
            const res = await fetch(process._);
            const err = res.status !== 200?res.status:null;
            if (err) {
                stdout.error("Response returned " + Fore.Bright + Fore.Red + err + Fore.Reset + " code.");
                return 1;
            }
            const data = await res.text();
            stdout.log(data, true);
            return 0;
        },
        about: `Read file content.%ALIASES%\nExamples:\n $ cat ./file.txt\n $ cat https://example.com/file.txt`
    },
    "echo": {
        func: async function (process, isInput = false) {
            if (process._ == "") {
                return "";
            }

            stdout.log(process._, false);

            if(isInput) return "";

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
            return 0;
        },
        about: `Clear console.%ALIASES%`
    },
    "bash": {
        func: async function (process) {
            await fetch(process._).then(res => res.text()).then(async (scriptContent) => {
                if (!(scriptContent === "")) await executeScript(scriptContent);
            });
            return 0;
        },
        about: `Run script.%ALIASES%\nExample:\n $ bash ./file.sh\n $ bash https://example.com/script.sh`
    },
    "sh": {
        func: async function (process, isInput = false) {
            if(isInput) {
                const inputProcess = parseInput(process._);
                if (commands[inputProcess.command]) {
                    const result = await commands[inputProcess.command].func(inputProcess);
                    if (result !== 0)
                        stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
                }
        
                else if (inputProcess.command in aliases) {
                    const result = await commands[aliases[inputProcess.command]].func(inputProcess);
                    if (result !== 0)
                        stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
                }
                
                else {
                    stdout.error("Command not found.");
                }
                return rawPrefix;
            }
            if (process._ == "") {
                return rawPrefix;
            }
            
            return 0;
        },
        about: `Execute input.%ALIASES%`
    },
    "ipinfo": {
        func: async function (process) {
            stdout.log(ipInfoText);
            return 0;
        },
        about: `Print system ip information.%ALIASES%\nExample:\n $ ipinfo`
    },
    "time": {
        func: async function (process) {
            if (process.options["kill"]) {
                clearInterval(timeInterval);
                return 0;
            }
            if (process.options["set"]) {
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
                return 0;
            }
            if (process.options["24h"]) {
                const time = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                stdout.log("<span class=\"time24\">" + time + "</span>", false);
            } else {
                const time = new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                stdout.log("<span class=\"time\">" + time + "</span>", false);
            }
            effectiveTime();
            return 0;
        },
        about: `Print system time.%ALIASES%\nFlags:\n --set: enable effective time\n --kill: disable effective time\n --24h: print time in 24 hours\nExamples:\n $ time\n $ time --24h`
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
            if (process.options.long) {
                stdout.log(new Date());
            } else {
                stdout.log(new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
            }
            return 0;
        },
        about: `Print system date.%ALIASES%\nExamples:\n $ date\n $ date --long`
    },
    "javascript": {
        func: async function (process, isInput = false) {

            if(isInput) allowMultiLines = true;

            if (process._ == "") {
                return "";
            }

            console.log = content => {
                stdOut.innerHTML += content+"\n";
            }

            let output;

            try {
                output = eval(process._);
                stdout.log(Fore.Gray + output + Fore.Reset);
            } catch (error) {
                stdout.log(error);
            }

            console.log = defaultLog;

            if(isInput) return "";

            return 0;
        },
        about: `TDK dictionary api.%ALIASES%\nExamples:\n $ tdk merhaba`
    },
    "bookmarks": {
        func: async function (process) {
            //// stdout.log(JSON.stringify(bookmarks, null, 4));
            stdout.log(await (async ()=>{
                let out = "";
                for await (const [key, value] of Object.entries(bookmarks)) {
                    out += Fore.BrightBlue + key + Fore.Reset + ": " + Fore.Blue + value + Fore.Reset + "\n";
                }
                return out.slice(0, -1);
            })());
            return 0;
        },
        about: `Print all bookmarks.%ALIASES%\nExamples:\n $ bookmarks`
    },
    "calc": {
        func: async function (process, isInput = false) {
            if (process._ == "") {
                return "";
            }

            stdout.log(math.calc(process._));

            if(isInput) return "";

            return 0;
        },
        about: `Calculator.%ALIASES%\nExamples:\n $ calc 2+2\n $ math 2+2`
    },
    "tdk": {
        func: async function (process, isInput = false) {
            if (process._ == "") {
                return "";
            }

            const url = "https://sozluk.gov.tr/gts?ara=" + encodeURI(process._);
            const res = await fetch(url);
            const data = await res.json();
            stdout.log(tdk(data));

            if(isInput) return "";

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
            const response = await fetch(url);
            const data = await response.text();
            stdout.log(data);
            return 0;
        },
        about: `Show weather.%ALIASES%\nFlags: -c: custom options\nExamples:\n $ wttr.in\n $ wttr İstanbul\n $ wttr -c İstanbul?0nA&lang=en`
    },
    /* This command not working because request blocking by CORS policy.

    "cht.sh": {
        func: async function (process) {
            let additionalOptions = "";
            if (process.options.c) additionalOptions += "Q";
            if (!process._ || process._ == "") {
                stdout.error("Please enter a search term.");
                return 1;
            } else {
                const res = await fetch(
                    "https://cht.sh/" +
                    encodeURI(process._) +
                    "?qT" +
                    additionalOptions
                );
                const data = await res.text();
                const doc = new DOMParser().parseFromString(data, 'text/html');
                const preElement = doc.querySelector("pre");
                const content = preElement.textContent;
                stdout.log(content);
            }
            return 0;
        },
        about: `Get cheat sheet.%ALIASES%\nFlags:\n -c: code only, don't show text\nExamples:\n $ cht.sh -c python/hello world\n $ cht.sh btrfs`
    }, */
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

    stdOut.innerHTML += prefix.innerHTML +
        command +
        "<br>";
    
    form.style.display = "none";



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

    const wtfismyipRES = await fetch("https://wtfismyip.com/json");
    const wtfismyipSJON = await wtfismyipRES.json();

    IPv6 = wtfismyipSJON["YourFuckingIPAddress"];
    ip_location = wtfismyipSJON["YourFuckingLocation"];
    ISP = wtfismyipSJON["YourFuckingISP"];

    const httpbinRES = await fetch("https://httpbin.org/ip", { "mode" : "cors" });
    const httpbinJSON = await httpbinRES.json();

    IPv4 = httpbinJSON.origin;

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

    if (!event.shiftKey && event.key == "Enter") {

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

    else if (!thisProcess && event.key == "ArrowUp") {

        event.preventDefault();

        if (currentHistoryElement > 0) {

            stdIn.value = history[currentHistoryElement - 1];
            currentHistoryElement-=1;

        }

    }

    else if (!thisProcess && event.key == "ArrowDown") {

        event.preventDefault();

        if (currentHistoryElement-1 < history.length) {

            stdIn.value = history[currentHistoryElement] ?? "";
            currentHistoryElement+=1;

        }

    }

    else if (event.ctrlKey && event.key == "c") {
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