function tdk(data) {
    let out = "";
    if (data.error) {
        out += Fore.Red+data.error+Fore.Reset+"\n";
        return out;
    }
    const wordj = data[0];
    let json = new Object();
    let anlams = new Array();
    for (let ai = 0; ai < wordj.anlamlarListe.length; ai++) {
        const anlamj = wordj.anlamlarListe[ai];
        anlams.push(anlamj.orneklerListe?[anlamj.anlam, anlamj.orneklerListe[0].ornek]:anlamj.anlam);
    }
    json.anlamlar=anlams;


    if (wordj.atasozu) {
        let atas = new Array();
        for (let ai = 0; ai < wordj.atasozu.length; ai++) {
            const ataj = wordj.atasozu[ai];
            atas.push(ataj.madde);
        }
        json.atasozu=atas;
    }


    if (wordj.birlesikler) {
        json.birlesikler=wordj.birlesikler.split(", ");
    }


    const sonucj = json;



    out += "\n";

    for (let ai = 0; ai < sonucj.anlamlar.length; ai++) {
        const anlam = sonucj.anlamlar[ai];
        out += (typeof anlam == 'object'?Fore.Blue+"  Anlam "+(ai+1)+Fore.Reset+": \n    "+anlam[0]+Fore.Cyan+"\n    Örnek"+Fore.Reset+": \n      "+anlam[1]:Fore.Blue+"  Anlam "+(ai+1)+Fore.Reset+": \n    "+anlam)+"\n"+"\n";
    }


    if (sonucj.atasozu) {
        out += Fore.Blue+"  Atasözleri"+Fore.Reset+":"+"\n";
        for (let ai = 0; ai < sonucj.atasozu.length; ai++) {
            out += "    "+sonucj.atasozu[ai]+"\n";
        }
        out += "\n";
    }


    if (sonucj.birlesikler) {
        out += Fore.Blue+"  Birleşik kelimeler"+Fore.Reset+":"+"\n";
        for (let ai = 0; ai < sonucj.birlesikler.length; ai++) {
            out += "    "+sonucj.birlesikler[ai]+"\n";
        }
        out += "\n";
    }

    return out.slice(0, -1);
}