commands["tdk"] = {
    func: async function (process, isInput = false) {

        // if no arguments
        if (process._ == "") {

            // set std input prefix to empty
            return ">&nbsp;";
        }

        // else make request
        const url = "https://sozluk.gov.tr/gts?ara=" + encodeURI(process._);
        const res = await request(url, {});
        const err = res.status !== 200 ? res.status : null;
        if (err) {
            stdout.error("Response returned " + Fore.Bright + Fore.Red + err + Fore.Reset + " code.");
            return err;
        }
        const data = await res.json();

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
