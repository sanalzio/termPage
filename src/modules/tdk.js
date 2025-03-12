var SOZLUK_autoComp;

commands["tdk"] = {
    func: async function (process, isInput = false) {

        // if no arguments
        if (process._ == "") {

            if (!SOZLUK_autoComp) {
                const req = await request("./database/autocomp.json");
                if (!req) {
                    stdout.error("Request failed.");
                    return 500;
                }
                SOZLUK_autoComp = await req.json();
                commands.tdk.autoComplete = SOZLUK_autoComp;
            }
    
            if (!commands.tdk.autoComplete) 
                commands.tdk.autoComplete = SOZLUK_autoComp;

            // set std input prefix to empty
            return ">&nbsp;";
        }

        // else make request
        const url = "https://sozluk.gov.tr/gts?ara=" + encodeURI(process._);
        const req = await request(url);
        if (!req) {
            stdout.error("Request failed.");
            return 500;
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
    about: `TDK dictionary api. %ALIASES%\nExamples:\n $ tdk merhaba`
};

autoCompList.push("tdk");
