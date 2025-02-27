addCommand(
    "example", // command name
    async function (process, isInput = false) {  // command operations
        stdout.log("Example command!");
        return 0;
    },
    "Example module command. %ALIASES%", // about this command
    ["ex",] // command aliases
);
