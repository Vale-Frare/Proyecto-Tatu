export class hudHelper {
    static cargarHudDesdeJson(file: string) {
        return new Promise((resolve, reject) => {
            fetch(file).then((response) => response.json()).then((data) => {
                let newData = {
                    layers: { 
                        hud_botones: {content:[], depth: 5},
                        hud_paneles: {content:[], depth: 4},
                        hud_fondo: {content:[], depth: 3}
                    },
                    animations: {}
                }

                data.layers.forEach((layer) => {
                    if (layer.name.substring(0, 5) == "nodos") {
                        newData.animations[layer.name] = layer.objects;
                    }else if (layer.name != "fondo" && layer.name.substring(0, 5) != "nodos") {
                        if (layer.properties) {
                            newData.layers[layer.name] = {
                                content: layer.objects,
                                depth: newData.layers[layer.name].depth ? newData.layers[layer.name].depth : 5,
                                properties: layer.properties
                            }
                        }else {
                            newData.layers[layer.name] = {
                                content: layer.objects,
                                depth: newData.layers[layer.name].depth ? newData.layers[layer.name].depth : 5,
                                properties: null
                            }
                        }
                    }
                });

                localStorage.setItem(file.split('/')[2].split('.json')[0], JSON.stringify(newData));
                resolve(newData);
            });
        });
    }
}