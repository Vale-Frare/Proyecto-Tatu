export default class tiledHelper {
    static cargarMapaDesdeJson(file: string) {
        return new Promise((resolve, reject) => {
            fetch(file).then(response => response.json()).then(data => {
                let newData = {
                    name: file.split('/')[2].split('.json')[0],
                    objects: null,
                    gids: 0,
                };
                data.layers.forEach((layer: any, index: number) => {
                    if (layer.name == "pelotas") {
                        newData.objects = data.layers[index].objects;
                        data.layers[index].objects.forEach((object: any, index: number) => {
                            if (object.gid > newData.gids) {
                                newData.gids = object.gid;
                            }
                            newData.objects[index].x = (object.x) + (object.width / 2);
                            newData.objects[index].y = object.y - (object.height/2);
                            newData.objects[index].gid -= 2;
                        });
                    }
                });
                localStorage.setItem(file.split('/')[2].split('.json')[0], JSON.stringify(newData));
            }).catch(error => {
                reject(error);
            });
        });
    }
}