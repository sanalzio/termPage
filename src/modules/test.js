commands["test"] = {
    func: async function (process, isInput = false) {
        if (isInput) {
            stdout.log("Input.");
        }
        if (process.options.test) {
            return "> ";
        }
        if (process.options.error) {
            nonExistentFunction();
        }
        if (process.options.error2) {
            return 1;
        }
        if (process.options.color || process.options.colors) {
            Object.keys(Style)
                .filter(cKey => !cKey.startsWith("Not"))
                .forEach(cKey => {
                    stdout.write(Style[cKey] + "Style." + cKey + Reset + " ", true);
                });
            Object.keys(Fore)
                .filter(cKey => cKey != "rgb" && cKey != "Bit8" && cKey != "Reset")
                .forEach(cKey => {
                    stdout.write(Fore[cKey] + "Fore." + cKey + Reset + " ", true);
                });
            Object.keys(Back)
                .filter(cKey => cKey != "rgb" && cKey != "Bit8")
                .forEach(cKey => {
                    stdout.write(Back[cKey] + "Back." + cKey + Reset + " ", true);
                });
            return 0;
        }

        stdout.log(JSON.stringify(process, null, 2));

        return 0;
    },
    beforeExit: async function (keyboardInput, error = false) {
        stdout.log(error ? "Error." : keyboardInput ? "Keyboard input." : "Normal exit.");
    },
    autoComplete: [
        "example1",
        "example2"
    ],
    about: `Test command. %ALIASES%\nFlags:\n -color\n -test\n -error\n -error2`
};

session.autoCompList.push("test");


commands["test-reload-scripts"] = {
    func: async function (process, isInput = false) {

        reloadScripts();
        return 0;
    },
    about: `Reloads all javascript scripts and modules. %ALIASES%`
};

session.autoCompList.push("test-reload-scripts");
