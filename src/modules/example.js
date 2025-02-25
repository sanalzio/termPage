commands["example"] = { // "example" = command name
    func: async function (process, isInput = false) {
        stdout.log("Example command!");
        return 0;
    },
    about: `Example module command.%ALIASES%`
};

aliases["ex"] = "example"; // "example" = aliases name

autoCompList.push("example"); // for autocomplete
