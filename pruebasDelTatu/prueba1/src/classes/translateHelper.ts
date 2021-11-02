export class translateHelper {
    static cargarTraducciones(lang: string) {
        return new Promise((resolve, reject) => {
            let apiFede = `https://traduci-la.herokuapp.com/rest/translation?project_id=ckvhrn33h12221nyg31y1zv6f&lang=${lang}`;
            let apiFrase = `https://voluminouslegalmeasurements.frasesegundo.repl.co/tatu/?lang=${lang}`;

            fetch(apiFede).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                resolve(data);
            }).catch((error) => {
                fetch(apiFrase).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    resolve(data);
                }); 
            });
        }).catch((error) => {
            console.log(error, "auch");
        });
    }
}