export class translateHelper {
    static cargarTraducciones(lang: string) {
        return new Promise((resolve, reject) => {
            let apiFede = "https://traduci-la.herokuapp.com/rest";
            let apiFrase = `https://voluminouslegalmeasurements.frasesegundo.repl.co/tatu/?lang=${lang}`;

            fetch(apiFrase).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                resolve(data);
            });
        });
    }
}