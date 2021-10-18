export class tiledHelper {
    static cargarMapaDesdeJson(file: string) {
        return new Promise((resolve, reject) => {
            fetch(file).then(response => response.json()).then(data => {
                let newData = {
                    name: file.split('/')[2].split('.json')[0],
                    objects: null,
                    bordesDepth: 0,
                    gids: 0,
                    tileWidth: 0,
                    tileHeight: 0,
                    basuraWidth: 0,
                    basuraHeight: 0,
                    fondos: [],
                    bordes: [],
                    lugar_de_inicio: ""
                };
                try {newData.lugar_de_inicio = data.properties.find(_ => _.name == "lugar_de_comienzo").value}
                catch (e) {alert(`No se encontro lugar_de_comienzo en los atributos personalizados del mapa de Tiled. \n${newData.name}.json`)};
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
                    if (layer.type == "tilelayer") {
                        layer.depth = index - 2;
                        newData.fondos.push(layer);  
                    }
                    if (layer.name == "bordes") {
                        newData.bordesDepth = index - 1;
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