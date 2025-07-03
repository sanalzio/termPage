// ●○ ☐☑

const todoChars = settings["todo-chars"] ?? ["☐", "☑"];

async function TODO_saveData(data, message) {
    await browserObj.storage.local.set({todo:data}, () => {
        if (browserObj.runtime.lastError) {
            stdout.error(browserObj.runtime.lastError);
        } else {
            stdout.log(message);
        }
    });
}

async function TODO_printList(data) {
    (settings["todo-order-by"] && settings["todo-order-by"] == "asc" ? data.reverse() : data).forEach((taskObj, index) => {
        stdout.log(
            (
                taskObj[1] ?
                "&nbsp;<span class=\"exec-cmd no-text-decoration ansi-green-fg\" command=\"todo uc " + (index + 1) + "\">" + todoChars[1] + "</span>&nbsp;" :
                "&nbsp;<span class=\"exec-cmd no-text-decoration ansi-green-fg\" command=\"todo c " + (index + 1) + "\">" + todoChars[0] + "</span>&nbsp;"
            ) +
            taskObj[0],

            false
        );
    });
}

function TODO_createDailyCookie() {
    const now = new Date();
    const tomorrowMidnight = new Date(now);
    tomorrowMidnight.setDate(now.getDate() + 1);
    tomorrowMidnight.setHours(0, 0, 0, 0); // tomorrow 00:00

    document.cookie = `todoshowedtoday=true; expires=${tomorrowMidnight.toUTCString()}; path=/`;
}

function TODO_todayShowed() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(c => c.startsWith("todoshowedtoday="));
    return Boolean(cookie); // varsa true, yoksa false döner
}

function TODO_format(str) {
    return str
        // markdown links ex: [Display text](https://example.com/)
        .replace(/\[([^\]]*)\]\s?\(([(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))\)/g, "<a href=\"$1\">$2</a>")

        // markdown italic
        .replace(/(\*|_)([\s\S]+)\1/g, "<span style=\"font-style:italic\">$2</span>")

        // markdown bold + italic
        .replace(/(\*|_)\1{2}([\s\S]+)\1{3}/g, "<span style=\"font-weight:bold;font-style:italic\">$2</span>")

        // markdown bold
        .replace(/(\*|_)\1([\s\S]+)\1{2}/g, "<span style=\"font-weight:bold\">$2</span>");
}

commands["todo"] = {
    func: async function (process, isInput = false) {

        if (typeof browserObj == "undefined" || typeof browserObj.storage == "undefined") {
            stdout.error("\"storage\" permission not granted.");
            return 1;
        }

        let data = await new Promise((resolve, reject) => {
            browserObj.storage.local.get("todo", (result) => {
                if (browserObj.runtime.lastError) {
                    reject(browserObj.runtime.lastError);
                } else {
                    resolve(result["todo"]);
                }
            });
        }) ?? new Array();

        if (process.argv[0] == "edit") {
            return "> ";
        }

        if (process.argv[0]) switch (process.argv[0]) {
            case "add":
            case "a":
                if (process.argv.length > 1) {
                    data.push([TODO_format(process.argv.slice(1).join(" "))])
                } else {
                    data.push(["add"]);
                }
                await TODO_saveData(data, "New task added.");
                break;

            case "rm":
            case "remove":
                index = parseInt(process.argv[1]);
                if (!process.argv[1] || index == NaN || index > data.length) {
                    stdout.error("Index out of range.");
                    return isInput ? "> " : 2;
                }
                data.splice(index - 1, 1);
                await TODO_saveData(data, "Task removed.");
                break;

            case "pop":
                data.pop();
                await TODO_saveData(data, "Removed latest task.");
                break;

            case "check":
            case "c":
                index = parseInt(process.argv[1]);
                if (!process.argv[1] || index == NaN || index > data.length) {
                    stdout.error("Index out of range.");
                    return isInput ? "> " : 2;
                }
                data[index - 1][1] = true;
                await TODO_saveData(data, "Checked " + process.argv[1] + "th task.");
                break;

            case "uncheck":
            case "uc":
                index = parseInt(process.argv[1]);
                if (!process.argv[1] || index == NaN || index > data.length) {
                    stdout.error("Index out of range.");
                    return isInput ? "> " : 2;
                }
                data[index - 1][1] = false;
                await TODO_saveData(data, "Unchecked " + process.argv[1] + "th task.");
                break;

            case "clear":
            case "cl":
                await TODO_saveData(new Array(), "Cleared todo list.");
                break;

            case "print":
            case "p":
                TODO_printList(data);
                break;

            case "exit":
            case "quit":
            case "e":
            case "q":
                return 0;
                break;

            case "daily":
            case "d":
                if (!TODO_todayShowed()) {
                    TODO_printList(data);
                    TODO_createDailyCookie();
                }
                break;

            default:
                if (process.argv.length > 0) {
                    data.push([TODO_format(process.argv.join(" "))])
                    await TODO_saveData(data, "New task added.");
                }
        } else if (data && !isInput)
            TODO_printList(data);

        if(isInput) {
            return ">&nbsp;";
        }

        return 0;
    },
    beforeExit: function (keyboardInput) {

        if (keyboardInput) {
        }
    },
    autoComplete: [],
    about: `Manage todo list. %ALIASES%\nExamples:\n $ todo edit : Switch to edit mode.\n $ todo add <task description> : Add new task.\n $ todo rm <task index 1-∞> : Remove task with index.\n $ todo clear : Clear todo list.\n $ todo pop : Remove latest task.\n $ todo check <task index 1-∞> : Check task with index.\n $ todo uncheck <task index 1-∞> : Uncheck task with index.`
};

session.autoCompList.push("todo");
