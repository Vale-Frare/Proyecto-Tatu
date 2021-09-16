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
                    basuraHeight: 0,
                    fondos: [],
                    bordes: [],
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
                            newData.objects[index].gid -= 1;
                        });
                    }
                    var fondoCount = 0
                    if (layer.name == "fondo" || layer.name == "fondo_2") {
                        newData.fondos.push(layer);
                        fondoCount++;
                    }
                    if (layer.name == "bordes") {
                        newData.bordes = layer.objects;
                    }
                });
                data.tilesets.forEach((tileset: any, index: number) => {
                    if (tileset.name == "basuritas") {
                        newData.basuraHeight = tileset.tileheight;
                        newData.basuraWidth = tileset.tilewidth;
                    }
                    newData.fondos.forEach((fondo: any, index: number) => {
                        if (tileset.name == fondo.name) {
                            var _ = tileset.image.split('\/');
                            newData.fondos[index].key = tileset.image.split('\/')[_.length-1].split(tileset.image.split('\/')[_.length-1].slice(-4))[0];
                        }
                    });
                    newData.bordes.forEach((borde: any, index: number) => {
                        var _ = tileset.image.split('\/');
                        if (tileset.firstgid == borde.gid) {
                            borde.key = tileset.image.split('\/')[_.length-1].split(tileset.image.split('\/')[_.length-1].slice(-4))[0];
                        }
                    });
                });
                localStorage.setItem(file.split('/')[2].split('.json')[0], JSON.stringify(newData));
            }).catch(error => {
                reject(error);
            });
        });
    }
}