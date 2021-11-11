export class translateHelper {
    usarApiFede: boolean = true;
    usarApiFrase: boolean = true;
    usarArchivoLocal: boolean = true;

    async cargarTraducciones(lang: string) {
        return new Promise((resolve, reject) => {
            let apiFede = `https://traduci-la.herokuapp.com/rest/translation?project_id=ckvhrn33h12221nyg31y1zv6f&lang=${lang}`;
            let apiFrase = `https://voluminouslegalmeasurements.frasesegundo.repl.co/tatudb/?lang=${lang}`;
            let archivoEs = `assets/lang/es_AR.json`;
            if (this.usarApiFede) {
                fetch(apiFede).then((response) => {
                    return response.json();
                }).then((data) => {
                    resolve(data);
                }).catch((error) => {
                    this.usarApiFede = false;
                    fetch(apiFrase).then((response) => {
                        return response.json();
                    }).then((data) => {
                        console.log(data);
                        resolve(data);
                    }).catch((error) => {
                    // si no anda ninguna api
                        this.usarApiFrase = false;
                        fetch(archivoEs).then((response) => response.json()).then((data) => {
                            console.log(data);
                            resolve(data);
                        });
                    });; 
                });
            } else if (this.usarApiFrase) {
                fetch(apiFrase).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    resolve(data);
                }).catch((error) => {
                    this.usarApiFrase = false;
                    fetch(archivoEs).then((response) => response.json()).then((data) => {
                        console.log(data);
                        resolve(data);
                    });
                });
            } else if (this.usarArchivoLocal) {
                fetch(archivoEs).then((response) => response.json()).then((data) => {
                    console.log(data);
                    resolve(data);
                });
            }
        }).catch((error) => {
            console.log(error, "auch");
        });
    }
}
