export class hudHelper {
    static async cargarHudDesdeJson(file: string) {
        return new Promise((resolve, reject) => {
            fetch(file).then(response => response.json()).then(data => {
                let newData = {
                    layers: { 
                        hud_botones: {content:[], depth: 5},
                        hud_paneles: {content:[], depth: 4},
                        hud_fondo: {content:[], depth: 3}
                    }
                }

                data.layers.forEach((layer) => {
                    if (layer.name != "fondo") {
                        if (newData.layers[layer.name].depth) {
                            newData.layers[layer.name] = {
                                content: layer.objects,
                                depth: newData.layers[layer.name].depth
                            }
                        } else {
                            newData.layers[layer.name] = {
                                content: layer.objects,
                                depth: 5
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