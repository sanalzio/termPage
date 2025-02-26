commands["example"] = { // "example" = command name
    func: async function (process, isInput = false) {

        // if no argument
        if (process._ == "") {

            // set std input prefix
            return "";
        }

        if (process._.toLowerCase() == "ping")
            stdout.log("pong", false);

        // if is std input
        if(isInput)
            // set std input prefix
            return "";

        return 0;
    },
    autoComplete: [
        "ping",
        "PING"
    ],
    about: `Example module command.%ALIASES%`
};

aliases["ex"] = "example"; // "example" = aliases name

autoCompList.push("example"); // for autocomplete
autoCompList.push("ex"); // for autocomplete
