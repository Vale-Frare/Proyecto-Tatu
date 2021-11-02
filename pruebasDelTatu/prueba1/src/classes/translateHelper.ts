export class translateHelper {
    static cargarTraducciones(url: string) {
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                resolve(data);
            });
        });
    }
}