if (settings.check_for_updates_on_load) request("https://sanalzio.github.io/termPage/src/manifest.json")
    .then(res => {
        if (!res.ok) {
            return Promise.reject(res);
        }
        return res.json();
    })
    .then(json => {
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

        }
    })
    .catch(error => {
        if (typeof error.json === "function") {
            error.json().then(jsonError => {
                console.log("Check for updates: Json error from API");
                console.log(jsonError);
            }).catch(genericError => {
                console.log("Check for updates: Generic error from API");
                console.log(error.statusText);
            });
        } else {
            console.log("Check for updates: Fetch error");
            console.log(error);
        }
    });

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
    about: `Checks for updates. %ALIASES%\nFlags: --jsconsole: If no updates are found, prints the message to JavaScript console.`
};

aliases["cfu"] = "checkForUpdates";

session.autoCompList.push("checkForUpdates");
session.autoCompList.push("cfu");
