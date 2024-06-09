/* constant values */

const stdout = {
    log: function (text, format = true) {
        if (!format) {
            stdOut.innerHTML += text + "<br>"
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
    startProcess: function () {

        if (stdOut.innerHTML.toLowerCase().endsWith("<br>") || stdOut.innerHTML.toLowerCase().endsWith("<br/>") || stdOut.innerHTML == "") {
    
            stdOut.innerHTML += prefix.innerHTML +
                stdIn.value +
                "<br>";
    
        } else {
    
            stdOut.innerHTML += "<br>" +
                prefix.innerHTML +
                stdIn.value +
                "<br>";
    
        }
        
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

const ansi_up = new AnsiUp;
ansi_up.use_classes = true;

const math = new lzar();

let aliases, bookmarks, settings, manifest, aboutContent;

let IPv4, IPv6, ip_location, ISP;

let ipInfoText;

/* constant values */


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

    return { argv, options, _ };
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
        about: "Test command."
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
        about: "Switch echo on/off. Example:\n $ @echo on\n $ @echo off"
    },
    "echo": {
        func: async function (process) {
            stdout.log(process._);
            return 0;
        },
        about: "Echo command."
    },
    "clear": {
        func: async function (process) {
            stdout.clear();
            return 0;
        },
        about: "Clear console."
    },
    "bash": {
        func: async function (process) {
            await fetch(process._).then(res => res.text()).then(async (scriptContent) => {
                if (!(scriptContent === "")) await executeScript(scriptContent);
            });
            return 0;
        },
        about: "Run script. Example:\n $ bash ./file.sh\n $ bash https://example.com/script.sh"
    },
    "ipinfo": {
        func: async function (process) {
            stdout.log(ipInfoText);
            return 0;
        },
        about: "Print system ip information. Example:\n $ ipinfo"
    },
    "time": {
        func: async function (process) {
            if (process.options["24h"]) {
                stdout.log(new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            } else {
                stdout.log(new Date().toLocaleTimeString([], { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
            }
            return 0;
        },
        about: "Print system time. Examples:\n $ time\n $ time --24h"
    },
    "about": {
        func: async function (process) {
            stdout.log(aboutContent);
            return 0;
        },
        about: "Print information."
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
        about: "Print system date. Examples:\n $ date\n $ date --long"
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
        about: "Print all bookmarks. Examples:\n $ bookmarks"
    },
    "calc": {
        func: async function (process) {
            stdout.log(math.calc(process._));
            return 0;
        },
        about: "Calculator. Aliases: math, calculator, lzar\nExamples:\n $ calc 2+2\n $ math 2+2"
    },
    "tdk": {
        func: async function (process) {
            const url = "https://sozluk.gov.tr/gts?ara=" + encodeURI(process._);
            const res = await fetch(url);
            const data = await res.json();
            stdout.log(tdk(data));
            return 0;
        },
        about: "TDK dictionary api. Examples:\n $ tdk merhaba"
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
        about: "Go bookmark.\nFlags: -b: open in new tab\nExamples:\n $ go github\n $ go -b github",
    },
    "openurl": {
        func: async function (process) {
            window.open(process._, "_blank");
            return 0;
        },
        about: "Open url. Examples:\n $ openurl https://example.com"
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
        about: "Show weather. Aliases: weather, wttr\nFlags: -c: custom options\nExamples:\n $ wttr.in\n $ wttr İstanbul\n $ wttr -c İstanbul?0nA&lang=en"
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
        about: "Search in the web. Flags: -b: open in new tab\nAliases: s\nExamples:\n $ search sanalzio\n $ s -b sanalzio"
    },
    "help": {
        func: async function (process) {
            for (const command in commands) {
                stdout.log(Fore.BrightBlue + command + Fore.Reset + ": " + Fore.Blue + commands[command].about + Fore.Reset + "\n");
            }
            return 0;
        },
        about: "Show help. Aliases: h, ?"
    },
}

/* commands */


/* execute command function */

async function execute(command) {

    let exitCode = 0;
    

    if (stdOut.innerHTML.toLowerCase().endsWith("<br>") || stdOut.innerHTML.toLowerCase().endsWith("<br/>") || stdOut.innerHTML == "") {

        stdOut.innerHTML += prefix.innerHTML +
            " " +
            command +
            "<br>";

    } else {

        stdOut.innerHTML += "<br>" +
            prefix.innerHTML +
            " " +
            command +
            "<br>";

    }
    
    form.style.display = "none";



    if(command === "" || command.startsWith("#")) exitCode = 0;

    const process = parseInput(command);
        
    if (commands[process.argv[0]]) {
        exitCode = await commands[process.argv[0]].func(process);
        if (exitCode !== 0) {
            stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + exitCode + Fore.Reset);
        }
    }

    else if (process.argv[0] in aliases) {
        exitCode = await commands[aliases[process.argv[0]]].func(process);
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
            
        if (commands[process.argv[0]]) {
            exitCode = await commands[process.argv[0]].func(process);
            if (exitCode !== 0) {
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + exitCode + Fore.Reset);
            }
        }

        else if (process.argv[0] in aliases) {
            exitCode = await commands[aliases[process.argv[0]]].func(process);
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

    settings = manifest.page_settings;
    aliases = manifest.aliases;
    bookmarks = manifest.bookmarks;

    const wtfismyipRES = await fetch("https://wtfismyip.com/json");
    const wtfismyipSJON = await wtfismyipRES.json();

    IPv6 = wtfismyipSJON["YourFuckingIPAddress"];
    ip_location = wtfismyipSJON["YourFuckingLocation"];
    ISP = wtfismyipSJON["YourFuckingISP"];

    const httpbinRES = await fetch("https://httpbin.org/ip", { "mode" : "cors" });
    const httpbinJSON = await httpbinRES.json();

    IPv4 = httpbinJSON.origin;

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

    form.style.display = "flex";
    mainDiv.scrollTop = mainDiv.scrollHeight;

    if (
        document.activeElement === document.body &&
        window.location.host !== "localhost" &&
        window.location.host !== "127.0.0.1:3000"
    ) {
        stdIn.focus();
    }
    if (settings.allowLoadScript) await fetch("./load.sh").then(async res => await res.text()).then(async (loadScript) => {
        if (!(loadScript === "")) await executeScript(loadScript);
    });
});

/* on load */


/* input button events */

stdIn.addEventListener("keydown", async (event) => {

    if (event.key == "Enter") {
        
        stdout.startProcess();

        if(stdIn.value === "" || stdIn.value.startsWith("#")) {
            stdout.exitProcess();
            return;
        };

        const process = parseInput(stdIn.value);
        
        if (commands[process.argv[0]]) {
            const result = await commands[process.argv[0]].func(process);
            if (result !== 0) {
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
            }
        }

        else if (process.argv[0] in aliases) {
            const result = await commands[aliases[process.argv[0]]].func(process);
            if (result !== 0) {
                stdout.log(Fore.Red + "The operation returned an error. Exit code " + Fore.Bright + result + Fore.Reset);
            }
        }
        
        else {
            stdout.error("Command not found.");
        }

        stdout.exitProcess();

    }

    else if (event.key == "ArrowUp") {

        event.preventDefault();

        if (currentHistoryElement > 0) {

            stdIn.value = history[currentHistoryElement - 1];
            currentHistoryElement-=1;

        }

    }

    else if (event.key == "ArrowDown") {

        event.preventDefault();

        if (currentHistoryElement-1 < history.length) {

            stdIn.value = history[currentHistoryElement] ?? "";
            currentHistoryElement+=1;

        }

    }

});

/* input button events */