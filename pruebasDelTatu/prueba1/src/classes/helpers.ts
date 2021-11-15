import Phaser from 'phaser';
import {BolitaLanzada} from '../classes/prefabs';
import {shotController} from '../classes/shotController';

export class Matriz {
    static deckFromMatriz(matriz, data, pocos_grupos, armadillon = false) {
        let deck = [];
        let nivelArmadillom = armadillon;
        let armadillonC = 5;
        let matrizInvertida = matriz.slice().reverse();
        let gruposDestruidos = [];
        let indice = 0;
        matrizInvertida.forEach(fila => {
            fila.forEach((bolita, index) => {
                if (bolita != null) {
                    if (gruposDestruidos.find(grupo => grupo == bolita.grupo) == undefined) {
                        if (bolita.color != -1) {
                            deck.push(
                                {obj: null, type: 0, color: data.diccionarioDeColores[bolita.color]}
                            );
                            if (nivelArmadillom) {
                                armadillonC--;
                                if (armadillonC == 0) {
                                    deck.push(
                                        {obj: null, type: 0, color: 5}
                                    );
                                    nivelArmadillom = false;
                                }
                            }
                            if(pocos_grupos){
                                if(indice != 0){
                                    deck.push(
                                        {obj: null, type: 0, color: data.diccionarioDeColores[bolita.color]}
                                    );
                                }
                                indice++;
                            }
                            if (fila.length - 1 != index) {
                                if (fila[index].color != fila[index+1].color) {
                                    deck.push(
                                        {obj: null, type: 0, color: data.diccionarioDeColores[bolita.color]}
                                    );
                                }
                            }
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
            console.log(e, "ERROR");
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
    static tiro(scene: Phaser.Scene, data, rotacion, acciones) {
        
        let nivel_finalizado = true;
        let color_correcto = false;
        let armadillon_mode = false;
        let durabilidad_armadillon = 10;
        let bolitas_rotas: number[] = [];
        let grupos_afectados: number[] = [];
        let sm: any = scene.scene.get("soundManager");
        let armadillon = false;

        async function comprobar_victoria() {
            let ganaste = false;
            let terminar = false;
            data.nivelCargado.forEach(fila => {
                fila.forEach(elemento => {
                    if (terminar) {
                        ganaste = false;
                    }
                    else {
                        if (elemento) {
                            terminar = true;
                            return false;
                        }else {
                            ganaste = true;
                        }
                    }
                });
            });
            return ganaste;
        }

        function recalcularGrupo(grupo: number) {
            let matriz = [];
            data.nivelCargado.forEach((fila_bolitas, index_fila) => {
                let fila = [];
                fila_bolitas.forEach((bolita_nivel, index) => {
                    fila.push(null);
                    if (bolita_nivel && bolita_nivel.grupo == grupo) {
                        fila[index] = bolita_nivel.grupo;
                    }else
                    {fila[index] = -1}
                });
                matriz.push(fila);
            }, scene);
            matriz = Matriz.convertirAGrupos(matriz);
            data.nivelCargado.forEach((fila_bolitas, index_fila) => {
                fila_bolitas.forEach((bolita_nivel, index) => {
                    if (data.nivelCargado[index_fila][index] && matriz[index_fila][index].grupo != 0) {
                        data.nivelCargado[index_fila][index].grupo = matriz[index_fila][index].grupo;
                        if (data.nivelCargado[index_fila][index].texto) data.nivelCargado[index_fila][index].texto.setText(matriz[index_fila][index].grupo);
                    }
                });
            }, scene);
        }

        async function romperGrupoDeBolitasHexagonales(bola_level, bola_lanzada){
            if (bolitas_rotas.includes(bola_level.id)) return;
            if (!grupos_afectados.includes(bola_level.grupo)) {
                grupos_afectados.push(bola_level.grupo);
            }
            bolitas_rotas.push(bola_level.id);
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
                color_correcto = true;
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
                                let fakebolita = scene.add.sprite(bolita.x, bolita.y, bolita.texture.key).setScale(bolita.scaleX, bolita.scaleY);
                                bolita.destroy();
                                fakebolita.setDepth(-1);
                                scene.tweens.add({
                                    targets: fakebolita,
                                    x: 540,
                                    y: 1600,
                                    duration: 300,
                                    delay: count * 50,
                                    yoyo: false,
                                    ease: 'Linear',
                                    loop: 0,
                                    onComplete: function () {
                                        fakebolita.destroy();
                                        sm.playSoundTatuChocaColorCorrecto();
                                    }
                                });
                                count++;
                            }
                        }
                    });
                });
            }else if (bola_lanzada.tintTopLeft == 0xCDCDCD) {
                color_correcto = true;
                armadillon_mode = true;
                let fakebolita = scene.add.sprite(bola_level.x, bola_level.y, bola_level.texture.key).setScale(bola_level.scaleX, bola_level.scaleY).setAlpha(0.5);
                bola_level.destroy();
                data.nivelCargado.forEach(fila_bolitas => {
                    fila_bolitas.forEach((bolita_nivel, index) => {
                        if (bolita_nivel == bola_level) {
                            fila_bolitas[index] = null;
                        }
                    });
                }, scene);
                fakebolita.setDepth(-1);
                scene.tweens.add({
                    targets: fakebolita,
                    x: 540,
                    y: 1600,
                    duration: 300,
                    yoyo: false,
                    ease: 'Linear',
                    loop: 0,
                    onComplete: function () {
                        fakebolita.destroy();
                        sm.playSoundTatuChocaColorCorrecto();
                    }
                });
            }
            //  vale: finalmente se rompe la bolita lanzada.
    
            let colores = [];            

            data.nivelCargado.forEach(fila => {
                fila.forEach(bolita => {
                    if(bolita){
                        nivel_finalizado = false;
                        if(colores.length == 0){
                            colores.push(bolita.texture.key);
                        }
                        else{
                            let cont = 0;
                            colores.forEach(color =>{
                                if (color == bolita.texture.key){
                                    cont++;
                                }
                            })
                            if(cont == 0){
                                colores.push(bolita.texture.key);
                            }
                        }
                    }
                })
            });
            colores.push('armadillon');
            data.deckController.reemplazarColor(colores);
            if(nivel_finalizado){
                let hud: any = this.scene.get("hud");
                hud.play_animacion("nodos_1");
                hud.cambiar_boton_niveles_niveles();
                data.pausa = true;
                sm.stopMusicPocoTiempo();
                sm.playMusic("victoria", 0.1, false);
                let progressManager : any = this.scene.get("ProgressManager");
                progressManager.winLevel(progressManager.getCurrentZone(), progressManager.getLevelToPlayInt());
            }
            
            if (!armadillon_mode) {
                let bola_lanzada_fake = scene.add.sprite(bola_lanzada.x, bola_lanzada.y, bola_lanzada.texture.key).setTint(bola_lanzada.tintTopLeft).setScale(bola_lanzada.scaleX, bola_lanzada.scaleY);
                bola_lanzada.destroy();
                let pos = {x: 540, y: 1700};
                if (bola_lanzada_fake.x > 540) {
                    pos.x = 1180;
                }else if (bola_lanzada_fake.x < 540) {
                    pos.x = -100;
                }
                let prevY = bola_lanzada_fake.y;
                scene.tweens.add({
                    targets: bola_lanzada_fake,
                    x: pos.x,
                    y: '+=100',
                    duration: 800,
                    delay: 0,
                    yoyo: false,
                    ease: 'Linear',
                    loop: 0,
                    onStart: function () {
                        bola_lanzada_fake.setDepth(-1);
                        bola_lanzada_fake.anims.play('tatu_bebe_camina', true);
                    },
                    onUpdate: function () {
                        bola_lanzada_fake.rotation = Phaser.Math.Angle.Between(bola_lanzada_fake.x, bola_lanzada_fake.y, pos.x, prevY + 100);
                    },
                    onComplete: function () {
                        bola_lanzada_fake.destroy();
                    }
                });
            }else {
                durabilidad_armadillon -= 1;
                let _ = await comprobar_victoria();
                if (_) {
                    let hud: any = scene.scene.get("hud");
                    hud.play_animacion("nodos_1");
                    hud.cambiar_boton_niveles_niveles();
                    data.pausa = true;
                    sm.stopMusicPocoTiempo();
                    sm.playMusic("victoria", 0.1, false);
                    let progressManager : any = this.scene.get("ProgressManager");
                    progressManager.winLevel(progressManager.getCurrentZone(), progressManager.getLevelToPlayInt());
                }
                if (durabilidad_armadillon == 0) {
                    let bola_lanzada_fake = scene.add.sprite(bola_lanzada.x, bola_lanzada.y, bola_lanzada.texture.key).setTint(bola_lanzada.tintTopLeft).setScale(bola_lanzada.scaleX, bola_lanzada.scaleY);
                    bola_lanzada.destroy();
                    let pos = {x: 540, y: 1700};
                    if (bola_lanzada_fake.x > 540) {
                        pos.x = 1180;
                    }else if (bola_lanzada_fake.x < 540) {
                        pos.x = -100;
                    }
                    let prevY = bola_lanzada_fake.y;
                    armadillon_mode = false;
                    durabilidad_armadillon = 10;
                    scene.tweens.add({
                        targets: bola_lanzada_fake,
                        x: pos.x,
                        y: '+=100',
                        duration: 800,
                        delay: 0,
                        yoyo: false,
                        ease: 'Linear',
                        loop: 0,
                        onStart: function () {
                            bola_lanzada_fake.setDepth(-1);
                            bola_lanzada_fake.anims.play('armadillon_camina', true);
                        },
                        onUpdate: function () {
                            bola_lanzada_fake.rotation = Phaser.Math.Angle.Between(bola_lanzada_fake.x, bola_lanzada_fake.y, pos.x, prevY + 100);
                        },
                        onComplete: async function () {
                            grupos_afectados.forEach(grupo => {
                                recalcularGrupo(grupo);
                            }, scene);
                            data.armadillon = false;
                            bola_lanzada_fake.destroy();
                        }
                    });
                }
            }

            if(color_correcto){
                sm.playSoundTatuChocaColorCorrecto();
            }
            else{
                sm.playSoundTatuChocaColorIncorrecto();
            }

            if (!armadillon_mode) data.bolas_destruidas++;

            if(!nivel_finalizado && (data.deck.length-data.bolas_destruidas) == 0){
                let hud: any = this.scene.get("hud");
                hud.play_animacion("nodos_2");
                hud.desactivar_todo_menos("boton_reiniciar");
                hud.cambiar_boton_niveles();
                data.pausa = true;
                sm.stopMusicPocoTiempo();
                sm.playMusic("derrota", 0.1, false);
            }
        }
        
        if (data.deckTween != undefined) {
            if (data.deckTween.isPlaying()) {return;}
        }
        if (data.bolitaALanzar >= data.deck.length) {
            return;
        }
        data.deckController.tirar();
        
        let bolita = new BolitaLanzada(scene, data.lanzador.x, data.lanzador.y, 0.265, data, rotacion).object;
        if (data.burbujas[data.deck[data.bolitaALanzar].color].color == 0xCDCDCD) {
            bolita.anims.play('armadillon');
            bolita.setBounce(1);
            data.armadillon = true;
        }else {
            bolita.anims.play('tatu_bebe');
        }
        bolita.setTint(data.burbujas[data.deck[data.bolitaALanzar].color].color);

        data.bolitas.push(bolita);

        //  vale: Esto desaparece la bolita lanzada para dar el efecto de que es la misma.
        data.deck[data.bolitaALanzar].obj.setVisible(false);

        //  vale: hice una pequeña modificacion porque el nivel cargado ahora es una matriz.
        data.nivelCargado.forEach(fila_bolitas => {
            fila_bolitas.forEach(bolita_nivel => {
                //  vale: hice otra modificacion para que no intente leer las bolitas que son null.
                if (bolita_nivel === null) {} else {
                    if (data.burbujas[data.deck[data.bolitaALanzar].color].color == 0xCDCDCD) {
                        bolita_nivel.collider = scene.physics.add.overlap(bolita_nivel, bolita, romperGrupoDeBolitasHexagonales, null, scene);
                    }else {
                        bolita_nivel.collider = scene.physics.add.collider(bolita_nivel, bolita, romperGrupoDeBolitasHexagonales, null, scene);
                    }
                }
            });
        }, scene);

        new shotController(data, scene, bolita, nivel_finalizado, grupos_afectados);

        data.tiros++;

        acciones.updateAcciones(data.deck.length - data.tiros);
        
        data.bolitaALanzar += 1;
    }
}