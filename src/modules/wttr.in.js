commands["wttr.in"] = {
    func: async function (process) {
        if (process.options.c) {
            const url = "https://wttr.in/" + process._
            const response = await fetch(url);
            const data = await response.text();
            stdout.log(data);
            return 0;
        }
        const location = (()=>{
            if (process._) {
                return process._;
            } else {
                return settings.location;
            }
        })();
        const url = "https://wttr.in/" +
            location +
            "?0nA&lang=" +
            settings.language;
        try {
            const response = await fetch(url);
            const status = response.status;
            if (status !== 200) {
                return status;
            }
            const data = await response.text();
            stdout.log(data);
            return 0;
        } catch (error) {
            stdout.log(error);
            return 0;
        }
    },
    about: `Show weather. %ALIASES%\nFlags: -c: custom options\nExamples:\n $ wttr.in\n $ wttr New York\n $ wttr -c New York?0nA&lang=en`
}

aliases["weather"] = "wttr.in";
aliases["wttr"] = "wttr.in";

session.autoCompList.push("wttr.in");
session.autoCompList.push("wttr");
session.autoCompList.push("weather");

