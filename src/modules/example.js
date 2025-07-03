addCommand (
    "example", // command name

    // command operations
    async function (process, isInput = false) {
        stdout.log("Example command!");
        return 0;
    },

    // options
    {
        // about this command
        about: "Example module command. %ALIASES%",

        // command aliases
        aliases: ["ex", "exam"],

        // operations before exit
        beforeExit: async function (keyboardInput, error = false) {
            stdout.log(error ? "Error." : keyboardInput ? "Keyboard input." : "Normal exit.");
        }
    }
);
