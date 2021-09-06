import Phaser from 'phaser';
import Data from '../classes/data';
import Config from '../config';

let data: Data = new Data();

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    tiro() {
        if (data.deckTween != undefined) {
            if (data.deckTween.isPlaying()) {return;}
        }
        if (data.bolitaALanzar >= data.deck.length) {
            return;
        }
        data.deck.forEach(bolita => {
            data.deckTween = this.tweens.add({
                targets: bolita.obj,
                x: bolita.obj.x + 300,
                duration: 350,
                yoyo: false,
                ease: 'Power2',
                loop: 0
            });
        });
        
        let bolita = this.physics.add.sprite(900,1800, 'tatu_bebe');
        bolita.setTint(data.burbujas[data.deck[data.bolitaALanzar].color].color);

        //  vale: Esto desaparece la bolita lanzada para dar el efecto de que es la misma.
        data.deck[data.bolitaALanzar].obj.setVisible(false);

        bolita.setScale(0.3);
        bolita.depth = 1;
        bolita.angle = data.lanzador.rotation - 1.57;
        data.bolitas.push(bolita);
        bolita.body.setCircle(bolita.width/2);

        //  vale: hice una pequeña modificacion porque el nivel cargado ahora es una matriz.
        data.nivelCargado.forEach(fila_bolitas => {
            fila_bolitas.forEach(bolita_nivel => {
                //  vale: hice otra modificacion para que no intente leer las bolitas que son null.
                if (bolita_nivel === null) {} else {
                    this.physics.add.collider(bolita_nivel, bolita, this.romperGrupoDeBolitasHexagonales, null, this);
                }
            });
        }, this);
        
        data.bolitaALanzar += 1;
    }

    create() {
        let fondo = this.add.image(0, 0, 'fondo').setOrigin(0);
        fondo.depth = -1;
        let texto = `Cantidad de bolitas: ${data.bolitas.length}`;
        data.text1 = new Phaser.GameObjects.Text(this, 0, 0, texto, { fontFamily: 'Arial', fontSize: '75px', color: 'white' }).setOrigin(0);

        data.lanzador = this.add.sprite(900,1800,'flecha');
        let posicion_inicial;

        data.lanzador.setInteractive({ draggable: true })
        .on('dragstart', function(pointer, dragX, dragY){
            posicion_inicial = pointer.x;
        })
        .on('drag', function(pointer, dragX, dragY){
            data.lanzador.rotation = Phaser.Math.Clamp(data.lanzador.rotation + ((dragX / 10000) - 0.088), -0.8, 0.3);
        })
        .on('dragend', function(pointer, dragX, dragY, dropped){
            this.tiro();
        }, this)

        //this.input.on('pointerup', this.tiro, this);

        for(let i = data.deck.length - 1; i > -1; i--) {
            //let bolita = new Phaser.GameObjects.Sprite(this, 900 - (i * 300),1800,'tatu_bebe');
            let bolita = this.add.sprite(900 - (i * 300),1800,'tatu_bebe');
            bolita.setTint(data.burbujas[data.deck[i].color].color);
            //data.deck[i].obj = bolita;
            data.setObjInDeck(bolita, i);
            bolita.setDepth(5);
            bolita.setScale(0.3);
        }

        this.cargarNivelNuevo();
    }

    cargarNivelDesdeTiled(key: string) {
        const map = this.make.tilemap({ key: key });

        let objetos = map.createFromObjects('pelotas',{key:'basura_1'});

        objetos.forEach(objeto => {
            objeto.setVisible(false);
        });

        let matrizNivel = this.objetosAMatriz(objetos);

        let matrizNivelEmbolsada = this.aleatorizarConLaBolsa(matrizNivel);

        return this.convertirAGrupos(matrizNivelEmbolsada);
    }

    aleatorizarConLaBolsa(matriz) {
        let bolsa = [];
        let cantidad = 0;

        matriz.forEach(fila =>{
            fila.forEach(elemento => {
                if (elemento != -1) {
                    cantidad++;
                }
            });
        });

        cantidad = Math.ceil(cantidad / 3);

        for(let i = 0; i < 3; i++) {
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

    objetosAMatriz(objetos) {
        let matriz = [];

        let xSize = 0;
        let ySize = 0;

        let maxYSize = 0;

        objetos.forEach(objeto => { if (objeto.x > xSize) { xSize = objeto.x; ySize = objeto.y; } });
        if (this.esPar(ySize / 10)) 
        {xSize = Math.round((xSize - 40) / 40); ySize = Math.round((ySize - 10) / 40)} 
        else 
        {xSize = Math.round((xSize - 40) / 30); ySize = Math.round((ySize - 10) / 40)}

        objetos.forEach(objeto => {
            if (objeto.y > maxYSize) {
                maxYSize = objeto.y
            } 
        });

        xSize = xSize - 1;
        ySize = Math.round(((maxYSize - 20) / 30) + 1);
        
        for(let y = 0; y < ySize; y++) {
            let fila = [];
            for(let x = 0; x < xSize; x++) {
                fila.push(-1);
            }
            matriz.push(fila);
        }

        objetos.forEach(objeto => {
            if (this.esPar(objeto.y / 10)) {
                matriz[      Math.round((objeto.y - 20) / 30)][ Math.round((objeto.x - 20) / 40) ] = parseInt(objeto.name);
                
            }
            else {
                matriz[      Math.round((objeto.y - 20) / 30)][ Math.round((objeto.x - 40) / 40) ] = parseInt(objeto.name);
                
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

    update() {
        data.text1.text = `Cantidad de bolitas: ${data.bolitas.length}`;

        //lanzador.rotation = (game.input.mousePointer.x*.001)-.9;

        data.bolitas.forEach(bolita => {
            if (bolita.scene == undefined){
                data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
            }
            else{
                this.physics.velocityFromRotation(bolita.angle, 2600, bolita.body.velocity);
                if (bolita.y < 0) {
                    data.bolitas.splice(data.bolitas.indexOf(bolita), 1);
                    bolita.destroy();
                }
            }
        });
    }

    //  vale: Funcion que crea la matriz hexagonales con colores random y tambien agujeros.
    crearMatrizHexagonalRandom(xSize, ySize) {
        let matriz = [];
        let count = 0;
        for (let y = 0; y < ySize; y++) {
            let fila = [];
            if (this.esPar(y)) {
                for (let x = 0; x < xSize-1; x++) {
                    let color = Phaser.Math.Between(-1, 2);
                    fila.push({color:color, grupo:this.calcularGruposHexagonalmente(fila, matriz, y, x, color, count)});
                    count++;
                }
            }else{
                for (let x = 0; x < xSize; x++) {
                    let color = Phaser.Math.Between(-1, 2);
                    fila.push({color:color, grupo:this.calcularGruposHexagonalmente(fila, matriz, y, x, color, count)});
                    count++;
                }
            }
            matriz.push(fila);
        }
        return matriz;
    }

    crearMatrizConPatron(xSize, ySize, cellSize) {
        let matriz = [];
        
        let count = 0;
        let cellCount = 0;

        let colors = [0, 1, 2];

        colors = colors.sort(function (a, b) { 
            return (Math.random() * 2) - 1;
        })

        for (let y = 0; y < ySize; y++) {
            let fila = [];
            for (let x = 0; x < xSize; x++) {

                fila.push({
                    color: colors[0],
                    grupo: this.calcularGrupo(fila, matriz, y, x, colors[0], count)
                });

                if (cellCount == cellSize) {
                    colors = this.arrayUnPasito(colors);
                    cellCount = 0;
                }

                cellCount++;
                count++;
            }
            
            matriz.push(fila);
        }

        return matriz;
    }

    calcularGrupo(fila, matriz, y, x, color, count) {
        //  vale: se determina el caso para poder evaluar su grupo.

        if ((x - 1) < 0 && (y - 1) < 0)  {
            //  vale: en el caso de ser la ezquina se retorna el valor del count.

            return count;
        }else if ((x - 1) >= 0 && (y - 1) >= 0) {
            //  vale: en el caso de tener una bolita arriba y una a la izquierda se evalua.

            let colorArriba = matriz[y - 1][x].color;
            let colorIzquierda = fila[x - 1].color;

            if (colorArriba == color && colorIzquierda == color) {
                //  vale: en el caso de colores iguales se procede a fundir los grupos en uno.

                return this.fundirGrupos(matriz, fila, matriz[y - 1][x].grupo, fila[x - 1].grupo);
            }else if (colorArriba == color && colorIzquierda != color) {
                //  vale: en el caso de color igual solo arriba se devuelve el grupo del de arriba.

                return matriz[y - 1][x].grupo;
            }else if (colorIzquierda == color && colorArriba != color) {
                //  vale: en el caso de color igual solo a la izquierda se devuelve el grupo de la izquierda.

                return fila[x - 1].grupo;
            }else if (colorIzquierda != color && colorArriba != color){
                //  vale: en el caso de colores diferentes se devuelve el valor del count.

                return count;
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

            let colorArriba = matriz[y - 1][x].color;

            if (colorArriba == color) {
                return matriz[y - 1][x].grupo;
            }else {
                return count;
            }
        }
    }   

    arrayUnPasito(array) {
        let newArray = [array.length];

        newArray[0] = array[array.length-1];

        for (let i = 0; i < array.length - 1; i++) {
            newArray[i+1] = array[i];
        }
        return newArray;
    }

    //  vale: Hay que cambiar esta funcion debido a que los hexagonos de Tiled funcionan diferente. :)

    //  vale: Funcion que hice que calcula los grupos de bolitas hexagonales.
    //        La hice en un delirio cosmico asi que no es muy facil de comprender pero funciona.

    calcularGruposHexagonalmente(fila, matriz, y, x, color, count) {
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
            console.log(e, "ERROREEEEEEEEEEEEEEEEEE")
            this.add.text((x * 125) + 230, (y * 125) + 400, `x`, { font: 'bold 85px Arial', color: 'black'}).setOrigin(0.5)
        }
    }

    esPar(num) {
        return num % 2 == 0;
    }

    esParPeroDevuelveFalse(num) {
        return !(num % 2 == 0);
    }

    //  vale: se puede usar sin necesidad de agregar los ultimos dos parametros.
    fundirGrupos(matriz, fila, grupo1, grupo2, triple=false, grupo3=null) {
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

    convertirAGrupos(matriz) {
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

    cargarNivelNuevo() {
        // nivel = this.convertirAGrupos(nivel);

        //let nivel = this.crearMatrizYFormarGrupos(6, 8, 3);

        //let nivel = this.crearMatrizConPatron(6, 6, 8);

        let nivel = this.cargarNivelDesdeTiled("tilemap");

        //let nivel = this.crearMatrizHexagonalRandom(6,6);

        const bolitasTexturas = [
            'basura_3', //  AZUL
            'basura_1', //  VERDE
            'basura_2', //  ROJA
        ];

        for (let y = 0; y < nivel.length; y++) {
            let fila = [];
            for (let x = 0; x < nivel[y].length; x++) {
                if (nivel[y][x].color != -1) {
                    if (this.esPar(y)) {
                        let bolita;
                        bolita = this.physics.add.sprite((x * 125) + 170, (y * 125) + 400, bolitasTexturas[nivel[y][x].color]);
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);

                        bolita.grupo = nivel[y][x].grupo;

                        //  vale: si usas el modo debug podes ver un texto sobre cada bolita con el numero de su grupo ;)
                        if (Config.config.physics.arcade.debug) this.add.text(bolita.x, bolita.y, `${nivel[y][x].grupo}`, { font: 'bold 85px Arial', color: 'black'}).setOrigin(0.5);

                        //  vale: se pushea la bolita a la fila.
                        fila.push(bolita);
                    }else {
                        let bolita;
                        bolita = this.physics.add.sprite((x * 125) + 230, (y * 125) + 400, bolitasTexturas[nivel[y][x].color]);
                        bolita.setScale(0.3);
                        bolita.depth = -1;
                        bolita.body.setImmovable(true);
                        bolita.body.moves = false;
                        bolita.body.setCircle(bolita.width/2);

                        bolita.grupo = nivel[y][x].grupo;

                        //console.log(bolita);

                        //  vale: si usas el modo debug podes ver un texto sobre cada bolita con el numero de su grupo ;)
                        if (Config.config.physics.arcade.debug) this.add.text(bolita.x, bolita.y, `${nivel[y][x].grupo}`, { font: 'bold 85px Arial', color: 'black'}).setOrigin(0.5);
                        
                        //  vale: se pushea la bolita a la fila.
                        fila.push(bolita);
                    }
                }else {
                    fila.push(null);
                }
            }
            //  vale: se pushea la fila al nivel cargado.
            data.nivelCargado.push(fila);
        }

        //  vale: se guardan los valores de los grupos en una matriz aparte.
        data.nivelCargadoGrupos = nivel;
    }

    //  vale: con esto rompes un grupo de bolitas hexagonales.
    romperGrupoDeBolitasHexagonales(bola_level, bola_lanzada){
        //  vale: se compara el color.

        if (bola_lanzada.tintTopLeft == data.bolitasTextYColors[bola_level.texture.key]) {
            //  vale: se obtiene el grupo de la bolita a romper en base a la posición.
            data.nivelCargado.forEach(fila => {
                fila.forEach(bolita => {
                    if (bolita){
                        if (bolita.grupo == bola_level.grupo) {
                            bolita.destroy();
                        }
                    }
                });
            });
        }
        //  vale: finalmente se rompe la bolita lanzada.

        bola_lanzada.destroy();
    }
    
}
