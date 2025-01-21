commands["example"] = { // "example" = command name
    func: async function (process) {
        stdout.log("Example command!");
        return 0;
    },
    about: `Example module command.%ALIASES%`
};

aliases["ex"] = "example"; // "example" = aliases name