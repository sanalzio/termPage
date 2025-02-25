commands["tdk"] = {
    func: async function (process, isInput = false) {

        // if no arguments
        if (process._ == "") {

            // set std input prefix to empty
            return ">&nbsp;";
        }

        // else make request
        const url = "https://sozluk.gov.tr/gts?ara=" + encodeURI(process._);
        const req = await request(url, {});
        if (!req) {
            stdout.error("Request failed.");
            return 503;
        }
        const data = await req.json();

        // format output with tdk function in "scripts/tdk.js" file and log
        stdout.log(tdk(data));

        // if is std input
        if(isInput)
            // set std input prefix to empty
            return ">&nbsp;";

        // exit
        return 0;
    },
    about: `TDK dictionary api.%ALIASES%\nExamples:\n $ tdk merhaba`
};

autoCompList.push("tdk");
