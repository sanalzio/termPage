addCommand(
    "example", // command name
    async function (process, isInput = false) {  // command operations
        stdout.log("Example command!");
        return 0;
    },
    ["ex",] // command aliases
);
