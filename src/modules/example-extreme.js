commands["sayhello"] = { // "sayhello" = command name
    func: async function (process, isInput = false) {

        // if no argument
        if (process._ == "") {

            // set std input prefix
            return "";
        }

        stdout.log("Hello " + process._, false);

        // if is std input
        if(isInput)
            // set std input prefix
            return "";

        return 0;
    },
    autoComplete: [
        "Sanalzio",
        "Virtualzio"
    ],
    about: `Example module command. %ALIASES%`
};

aliases["sayhi"] = "sayhello"; // "sayhi" : aliases name

session.autoCompList.push("sayhello"); // for autocomplete
session.autoCompList.push("sayhi"); // for autocomplete
