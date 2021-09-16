import Phaser from 'phaser';
import {BolitaLanzada} from '../classes/prefabs';

export class Matriz {
    static deckFromMatriz(matriz, data) {
        let deck = [];
        let matrizInvertida = matriz.slice().reverse();
        let gruposDestruidos = [];
        matrizInvertida.forEach(fila => {
            fila.forEach(bolita => {
                if (bolita != null) {
                    if (gruposDestruidos.find(grupo => grupo == bolita.grupo) == undefined) {
                        console.log(gruposDestruidos.find(grupo => grupo == bolita.grupo));
                        if (bolita.color != -1) {
                            deck.push(
                                {obj: null, type: 0, color: data.diccionarioDeColores[bolita.color]}
                            );
                            gruposDestruidos.push(bolita.grupo);
                        }
                    }
                }
            });
        });
        return deck;
    }

    static objetosAMatriz(objetos, alto, ancho) {
        let matriz = [];

        let xSize = 0;
        let ySize = 0;

        let maxYSize = 0;

        let alto_mitad = alto/2;
        let alto_75 = alto*.75;
        let ancho_max = ancho;
        let ancho_mitad = ancho/2

        objetos.forEach(objeto => {
            if (objeto.x > xSize) { xSize = objeto.x; ySize = objeto.y;}
        });

        if (this.esPar(Math.round((ySize - (alto_mitad)) / (alto_75)))) 
        {xSize = Math.round(((xSize - ancho_mitad) / ancho_max)); ySize = Math.round((ySize - alto_mitad) / alto_75)} 
        else 
        {xSize = Math.round((xSize - ancho_max) / ancho_max); ySize = Math.round((ySize - alto_mitad) / alto_75)}

        objetos.forEach(objeto => {
            if (objeto.y > maxYSize) {
                maxYSize = objeto.y
            } 
        });

        xSize = xSize - 1;

        ySize = Math.round(((maxYSize - alto_mitad) / alto_75) + 1);  

        for(let y = 0; y < ySize; y++) {
            let fila = [];
            for(let x = 0; x < xSize; x++) {
                fila.push(-1);
            }
            matriz.push(fila);
        }

        objetos.forEach(objeto => {
            if (this.esPar(Math.round((objeto.y - alto_mitad) / alto_75))) {
                matriz[      Math.round((objeto.y - alto_mitad) / alto_75)][ Math.round(((objeto.x - ancho_mitad) / ancho_max)) ] = parseInt(objeto.gid);
            }
            else {
                matriz[      Math.round((objeto.y - alto_mitad) / alto_75)][ Math.round((objeto.x - ancho_max) / ancho_max) ] = parseInt(objeto.gid);
            }
        });

        let filaMasGrande = 0;

        let count = 0;
        matriz.forEach(fila => {   
            if (fila.length > matriz[filaMasGrande].length) {
                filaMasGrande = count;
            }
            for (let i = 0; i < fila.length; i++) {
                if (fila[i] == undefined) {
                    fila[i] = -1;
                }
            }
            count++;
        });

        matriz.forEach(fila => {
            if (fila.length < matriz[filaMasGrande].length) {
                let diferencia = matriz[filaMasGrande].length - fila.length;
                for(let i = 0; i < diferencia; i++) {
                    fila.push(-1);
                }
            }
        });

        return matriz;
    }

    //  vale: Funcion que hice que calcula los grupos de bolitas hexagonales.
    static calcularGruposHexagonalmente(fila, matriz, y, x, color, count) {
        try {
            if ((x - 1) < 0 && (y - 1) < 0)  {
                //  vale: en el caso de ser la ezquina se retorna el valor del count.

                return count;
            }else if ((x - 1) >= 0 && (y - 1) >= 0) {
                //  vale: en el caso de tener una bolita arriba y una a la izquierda se evalua.

                if (this.esParPeroDevuelveFalse(y)) {
                    let colorArribaIzquierda = matriz[y - 1][x].color;
                    let colorArribaDerecha;
                    if (x != matriz[0].length - 1) {colorArribaDerecha = matriz[y - 1][x+1].color;}
                    let colorIzquierda = fila[x - 1].color;

                    if (x != matriz[0].length - 1) {
                        if (colorArribaDerecha == color && colorIzquierda == color && colorArribaIzquierda == color) {
                            return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x+1].grupo, true, fila[x - 1].grupo);
                        }else if(colorIzquierda != color) {
                            if (colorArribaDerecha == color && colorArribaIzquierda == color) {
                                return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x+1].grupo);
                            }else if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                                return matriz[y - 1][x].grupo;
                            }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                                return matriz[y - 1][x+1].grupo;
                            }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                                return count;
                            }
                        }else if(colorIzquierda == color) {
                            if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                                return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x].grupo);
                            }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                                return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x+1].grupo);
                            }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                                return fila[x - 1].grupo;
                            }
                        }
                    }else {
                        if (colorIzquierda == color && colorArribaIzquierda == color) {
                            return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, fila[x - 1].grupo);
                        }else if(colorIzquierda != color) {
                            if (colorArribaIzquierda == color) {
                                return matriz[y - 1][x].grupo;
                            }
                            else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                                return count;
                            }
                        }else if(colorIzquierda == color) {
                            if (colorArribaIzquierda == color) {
                                return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x].grupo);
                            }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                                return fila[x - 1].grupo;
                            }
                        }
                    }
                }else {
                    if (matriz[y - 1].length != x) {
                        let colorArribaIzquierda = matriz[y - 1][x-1].color;
                        let colorArribaDerecha = matriz[y - 1][x].color;
                        let colorIzquierda = fila[x - 1].color;

                        if (colorArribaDerecha == color && colorIzquierda == color && colorArribaIzquierda == color) {
                            return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x-1].grupo, true, fila[x - 1].grupo);
                        }else if(colorIzquierda != color) {
                            if (colorArribaDerecha == color && colorArribaIzquierda == color) {
                                return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x-1].grupo);
                            }else if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                                return matriz[y - 1][x-1].grupo;
                            }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                                return matriz[y - 1][x].grupo;
                            }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                                return count;
                            }
                        }else if(colorIzquierda == color) {
                            if (colorArribaDerecha != color && colorArribaIzquierda == color) {
                                return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x-1].grupo);
                            }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                                return this.fundirGrupos(matriz, fila, fila[x - 1].grupo, matriz[y - 1][x].grupo);
                            }else if (colorArribaDerecha != color && colorArribaIzquierda != color) {
                                return fila[x - 1].grupo;
                            }
                        }
                    }else {
                        let colorArribaIzquierda = matriz[y - 1][x-1].color;
                        let colorIzquierda = fila[x - 1].color;

                        if (colorArribaIzquierda == color && colorIzquierda == color) {
                            return this.fundirGrupos(matriz, fila, matriz[y - 1][x-1].grupo, fila[x - 1].grupo);
                        }else if (colorArribaIzquierda == color && colorIzquierda != color) { 
                            return matriz[y - 1][x-1].grupo;
                        }else if (colorIzquierda == color && colorArribaIzquierda != color) { 
                            return fila[x - 1].grupo;
                        }else if (colorArribaIzquierda != color && colorIzquierda != color) { 
                            return count;
                        }
                    }
                }
            }else if ((x - 1) >= 0 && (y - 1) < 0) {
                //  vale: en el caso de tener una bolita a la izquierda se evalua si el color coincide.

                let colorIzquierda = fila[x - 1].color;

                if (colorIzquierda == color) {
                    return fila[x - 1].grupo;
                }else {
                    return count;
                }
            }else if ((x - 1) < 0 && (y - 1) >= 0) {
                //  vale: en el caso de tener una bolita arriba y no una a la izquierda se evalua si el color coincide.

                if (this.esParPeroDevuelveFalse(y)) {
                    // vale: si es par se evaluan dos colores en la parte superior.

                    let colorArribaIzquierda = matriz[y - 1][x].color;
                    let colorArribaDerecha = matriz[y - 1][x+1].color;

                    if (colorArribaDerecha == color && colorArribaIzquierda == color) {
                        return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, matriz[y - 1][x+1].grupo);
                    }else if (colorArribaDerecha == color && colorArribaIzquierda != color) {
                        return matriz[y - 1][x+1].grupo;
                    }else if (colorArribaIzquierda == color && colorArribaDerecha != color) {
                        return matriz[y - 1][x].grupo;
                    }else if (colorArribaIzquierda != color && colorArribaDerecha != color){
                        return count;
                    }
                }else {
                    // vale: si es inpar solo se evalua un color en la parte superior.

                    let colorArriba = matriz[y - 1][x].color;

                    if (colorArriba == color) {
                        return matriz[y - 1][x].grupo;
                    }else {
                        return count;
                    }
                }
            }
        }
        catch (e) {
            console.log(e, "Error xd.");
        }
    }

    static esPar(num) {
        return num % 2 == 0;
    }

    static esParPeroDevuelveFalse(num) {
        return !(num % 2 == 0);
    }

    //  vale: se puede usar sin necesidad de agregar los ultimos dos parametros.
    static fundirGrupos(matriz, fila, grupo1, grupo2, triple=false, grupo3=null) {
        //  vale: se crea una matriz completa agregando la fila sin pushear a la matriz en progreso.

        let matrizCompleta = [];
        matriz.forEach(filaM => {
            matrizCompleta.push(filaM);
        });
        matrizCompleta.push(fila);

        let nuevoGrupo;
        let grupoAFundir;

        if (!triple) {
            //  vale: se evalua que grupo tiene el menor valor para determinar el valor del grupo fundido.

            if (grupo1 < grupo2) { 
                nuevoGrupo = grupo1;
                grupoAFundir = grupo2;
            }else {
                nuevoGrupo = grupo2;
                grupoAFundir = grupo1;
            }

            //  vale: se reemplazan todos los de valor mayor por el valor menor fundiendo el grupo.

            for (let y = 0; y < matrizCompleta.length; y++) { 
                for (let x = 0; x < matrizCompleta[y].length; x++) { 
                    if (matrizCompleta[y][x].grupo == grupoAFundir) {
                        matrizCompleta[y][x].grupo = nuevoGrupo;
                    }
                }
            }

            //  vale: se modifica la matriz en progreso para cambiar el valor de los grupos.

            for (let y = 0; y < matrizCompleta.length; y++) { 
                if (y == (matrizCompleta.length - 1)) {
                    fila = matrizCompleta[y];
                }else {
                    matriz[y] = matrizCompleta[y];
                }
            }
        }else {
            //  vale: este es un pequeño arreglo que hice para que pueda fusionar 3 grupos.
            //        se evalua que grupo tiene el menor valor para determinar el valor del grupo fundido
            //        y los otros dos quedan en un array.

            let gruposAFundir;
            nuevoGrupo = Math.max(...[grupo1, grupo2, grupo3]);
            gruposAFundir = [grupo1, grupo2, grupo3].sort(function(a, b) {return a - b;});
            gruposAFundir = gruposAFundir.splice(0, 2);

            for (let y = 0; y < matrizCompleta.length; y++) { 
                for (let x = 0; x < matrizCompleta[y].length; x++) { 
                    if (matrizCompleta[y][x].grupo == gruposAFundir[0] || matrizCompleta[y][x].grupo == gruposAFundir[1]) {
                        matrizCompleta[y][x].grupo = nuevoGrupo;
                    }
                }
            }

            for (let y = 0; y < matrizCompleta.length; y++) { 
                if (y == (matrizCompleta.length - 1)) {
                    fila = matrizCompleta[y];
                }else {
                    matriz[y] = matrizCompleta[y];
                }
            }
        }

        //  vale: se retorna el valor del nuevo grupo.
        return nuevoGrupo;
    }

    static convertirAGrupos(matriz) {
        let matrizNueva = []
        let count = 0;
        for (let y = 0; y < matriz.length; y++) {
            let fila = [];
            for (let x = 0; x < matriz[y].length; x++) {
                if (matriz[y][x] != null) {
                    fila.push(
                        {
                            color: matriz[y][x],
                            grupo: this.calcularGruposHexagonalmente(fila, matrizNueva, y, x, matriz[y][x], count)
                        }
                    );
                } else {fila.push(null)}
                count++;
            }
            matrizNueva.push(fila);
        }
        return matrizNueva;
    }
}

export class Aleatorizadores {
    static aleatorizarConLaBolsa(matriz, limite) {
        let bolsa = [];
        let cantidad = 0;

        matriz.forEach(fila =>{
            fila.forEach(elemento => {
                if (elemento != -1) {
                    cantidad++;
                }
            });
        });

        cantidad = Math.ceil(cantidad / limite);

        for(let i = 0; i < limite; i++) {
            for (let j = 0; j < cantidad; j++) {bolsa.push(i)}
        }

        bolsa = bolsa.sort(() => Math.random() - 0.5);

        let count = 0;
        let matrizMezclada = [];
        matriz.forEach(fila =>{
            let filaN = [];
            fila.forEach(elemento => {
                if (elemento != -1) {
                    filaN.push(bolsa[count]);
                    count++;
                }else{
                    filaN.push(-1);
                }
            });
            matrizMezclada.push(filaN)
        });
        return matrizMezclada;
    }
}

export class AccionesBolitas {
    static tiro(scene: Phaser.Scene, data, rotacion) {
        function romperGrupoDeBolitasHexagonales(bola_level, bola_lanzada){
            bola_lanzada.emitter.followOffset.x += 2000;
            let emitter = bola_lanzada.emitter;
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    emitter.killAll();
                }, 500);
            });
            //  vale: se compara el color.
    
            if (bola_lanzada.tintTopLeft == data.bolitasTextYColors[bola_level.texture.key]) {
                //  vale: se obtiene el grupo de la bolita a romper en base a la posición.
                let count = 0;
                data.nivelCargado.forEach(fila => {
                    fila.forEach(bolita => {
                        if (bolita){
                            if (bolita.grupo == bola_level.grupo) {
                                bolita.collider.destroy();
                                data.nivelCargado.forEach(fila_bolitas => {
                                    fila_bolitas.forEach((bolita_nivel, index) => {
                                        if (bolita_nivel == bolita) {
                                            fila_bolitas[index] = null;
                                        }
                                    });
                                }, scene);
                                scene.tweens.add({
                                    targets: bolita,
                                    rotation: Math.PI * 6,
                                    alpha: 0,
                                    duration: 1350 + (count * 150),
                                    yoyo: false,
                                    ease: 'Linear',
                                    loop: 0,
                                    onComplete: function () {
                                        bolita.destroy();
                                    }
                                });
                                count++;
                            }
                        }
                    });
                });
            }
            //  vale: finalmente se rompe la bolita lanzada.
    
            bola_lanzada.destroy();
        }
        
        if (data.deckTween != undefined) {
            if (data.deckTween.isPlaying()) {return;}
        }
        if (data.bolitaALanzar >= data.deck.length) {
            return;
        }
        data.deck.forEach(bolita => {
            data.deckTween = scene.tweens.add({
                targets: bolita.obj,
                x: bolita.obj.x + 300,
                duration: 350,
                yoyo: false,
                ease: 'Power2',
                loop: 0
            });
        });
        
        let bolita = new BolitaLanzada(scene, 900, 1800, 0.3, data, rotacion).object;
        bolita.setTint(data.burbujas[data.deck[data.bolitaALanzar].color].color);

        data.bolitas.push(bolita);

        //  vale: Esto desaparece la bolita lanzada para dar el efecto de que es la misma.
        data.deck[data.bolitaALanzar].obj.setVisible(false);

        //  vale: hice una pequeña modificacion porque el nivel cargado ahora es una matriz.
        data.nivelCargado.forEach(fila_bolitas => {
            fila_bolitas.forEach(bolita_nivel => {
                //  vale: hice otra modificacion para que no intente leer las bolitas que son null.
                if (bolita_nivel === null) {} else {
                    bolita_nivel.collider = scene.physics.add.collider(bolita_nivel, bolita, romperGrupoDeBolitasHexagonales, null, scene);
                }
            });
        }, scene);

        let overlaps = [];
        let paDespues;
        let bounces = 0;

        function onBounce(a) {
            console.log(a.emitter);
            a.emitter.followOffset.x += 2000;
            let emitter = a.emitter;
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    emitter.killAll();
                }, 500);
            });
            var particles = scene.add.particles('pastito');

            let geom = new Phaser.Geom.Ellipse(0, 0, 20, 1);
            console.log(a.angle);
            var _ = particles.createEmitter({
                radial: false,
                scale: { start: 0.3, end: 0, ease: 'Expo' },
                lifespan: { min: 1000, max: 2000 },
                frequency: 0,  
                quantity: 1,
                maxParticles: 0,
                emitZone:  { source: geom },
                rotate: { start: -a.angle + 90, end: -a.angle + 90}, // Esto ta re mal, hay que arreglarlo.
            });
            _.startFollow(a);
            _.setBlendMode(Phaser.BlendModes.NORMAL);
            a.emitter = _;
            bounces++;
            if (bounces >= 5) {
                a.destroy();

                a.emitter.followOffset.x += 2000;
                let emitter = a.emitter;
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        emitter.killAll();
                    }, 500);
                });
            }
        }

        function colisionesOn(param1, param2) {
            overlaps.forEach(overlap => {
                overlap.destroy();
            });
            data.bordes.forEach(borde => {
                if(param1 != borde){
                    scene.physics.add.collider(bolita, borde, onBounce, null, scene);
                }else {
                    paDespues = borde;
                }
            });
            new Promise(function (resolve, reject) {
                setTimeout(() => {
                    scene.physics.add.collider(bolita, paDespues, onBounce, null, scene);
                    resolve("nya");
                }, 200);
            });
        }

        data.bordes.forEach(borde => {
            overlaps.push(scene.physics.add.overlap(borde, bolita, colisionesOn, null, scene));
        });
        
        data.bolitaALanzar += 1;
    }
}