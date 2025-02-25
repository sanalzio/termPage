commands["checkForUpdates"] = {
    func: async function (process) {

        const req = await request("https://sanalzio.github.io/termPage/src/manifest.json");
        const json = await req.json();

        if (!req) {
            stdout.error("Request failed.");
            return 1;
        } if (req.status != 200) {
            stdout.error("Request failed.");
            return req.status;
        }

        if (manifest.version !== json.version) {
            stdout.log(
                "\n          " +
                Fore.Yellow +
                "New updates found: " +
                Fore.Red +
                manifest.version +
                Fore.BrightGreen +
                " => " +
                Reset +
                Fore.Green +
                json.version +
                "\n"
            );

            stdout.write(`  ${Fore.Magenta}$ ${Fore.rgb(240, 80, 50)}git ${Fore.BrightBlue}clone `, true, true);
            stdout.write("<a class=\"ansi-green-fg\" href=\"https://github.com/sanalzio/termPage.git\" tabindex=\"-1\">https://github.com/sanalzio/termPage.git</a><br>", false);

            stdout.write(`\n    ${Fore.Magenta}Repository: `, true , true);
            stdout.write("<a class=\"ansi-green-fg\" href=\"https://github.com/sanalzio/termPage\" tabindex=\"-1\">https://github.com/sanalzio/termPage</a><br><br>", false);

        } else {

            if (process.options.jsconsole) {

                console.log(`${manifest.name} is up to date!`);
                return 0;
            }

            stdout.log(`${Fore.Green}${manifest.name} is up to date!`);
        }

        return 0;
    },
    about: `Checks for updates.%ALIASES%\nFlags: --jsconsole: If no updates are found, prints the message to the JavaScript console.`
};

aliases["cfu"] = "checkForUpdates";

autoCompList.push("checkForUpdates");
autoCompList.push("cfu");
