export default class tiledHelper {
    static cargarMapaDesdeJson(file: string) {
        return new Promise((resolve, reject) => {
            fetch(file).then(response => response.json()).then(data => {
                let newData = {
                    name: file.split('/')[2].split('.json')[0],
                    objects: null,
                    gids: 0,
                    tileWidth: 0,
                    tileHeight: 0,
                    basuraWidth: 0,
                    basuraHeight: 0
                };
                data.layers.forEach((layer: any, index: number) => {
                    if (layer.name == "pelotas") {
                        newData.objects = data.layers[index].objects;
                        newData.tileWidth = data.tilewidth;
                        newData.tileHeight = data.tileheight;
                        data.layers[index].objects.forEach((object: any, index: number) => {
                            if (object.gid > newData.gids) {
                                newData.gids = object.gid;
                            }
                            newData.objects[index].x = Math.floor( object.x ) + (object.width / 2);
                            newData.objects[index].y = Math.floor( object.y ) - (object.height/2);
                            newData.objects[index].gid -= 2;
                        });
                    }
                });
                data.tilesets.forEach((tileset: any, index: number) => {
                    if (tileset.name == "basuritas") {
                        newData.basuraHeight = tileset.tileheight;
                        newData.basuraWidth = tileset.tilewidth;
                    }
                });
                localStorage.setItem(file.split('/')[2].split('.json')[0], JSON.stringify(newData));
            }).catch(error => {
                reject(error);
            });
        });
    }
}